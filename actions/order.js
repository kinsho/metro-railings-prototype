'use server'

import { cookies } from 'next/headers';

import {
	saveNewOrder,
	saveChangesToOrder,
	attachFileToOrder,
	deleteFileFromOrder as deleteOrderFile
} from 'lib/http/ordersDAO';

import {
	saveNewFile,
	deleteFile,
	getFilesByOrder,
	uploadFileToVercel,
	uploadImageToVercel,
	deleteFromVercel
} from 'lib/http/filesDAO';

import { validateEmail, validateEmpty, runValidators } from 'lib/validators/inputValidators';
import { acceptableImageExtensions, shopStatuses } from 'lib/dictionary';
import { sendLeadEmail } from 'lib/loopMailer';

export async function createProspectFromContactUs(data) {
	let newOrder = {};

	const validationFields = [
		{ prop: data.name, validator: validateEmpty, errorMsg: 'fail' },
		{ prop: data.phone, validator: validateEmpty, errorMsg: 'fail' },
		{ prop: data.comments, validator: validateEmpty, errorMsg: 'fail' },
		{ prop: data.email, validator: validateEmail, errorMsg: 'fail' }
	];

	try {
		// Just make sure the parameters are valid
		if (runValidators(validationFields).length === 0) {
			const phoneNumber = data.phone.split('-');

			newOrder.customer = {
				name: data.name,
				areaCode: phoneNumber[0],
				phoneOne: phoneNumber[1],
				phoneTwo: phoneNumber[2],
				address: data.address || '',
				city: data.city || '',
				state: data.state || '',
				emails: data.email ? [data.email] : []
			}

			await saveNewOrder(newOrder);
			await sendLeadEmail(data);
			return { success: true };
		}
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function saveOrder(data) {
	try {
		const order = data._id ? await saveChangesToOrder(data._id, data) : await saveNewOrder(data);
		return { success: true, order: JSON.stringify(order) };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function moveOrderIntoProduction(data) {
	try {
		const order = await saveChangesToOrder(data.orderId,{ 
			status: shopStatuses[0].key,
			'text.agreement': process.env.CURRENT_TERMS_AND_CONDITIONS_CONTRACT
		});
		return { success: true, order: order };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function addFileToOrder(formData) {
	const uploadedFile = formData.get('newFile');
	const orderId = formData.get('orderId');
	const uploader = JSON.parse(cookies().get('user').value).username;

	try {
		// Upload the file first to Vercel's blob service
		const fileBlob = acceptableImageExtensions[uploadedFile.type] ? await uploadImageToVercel(uploadedFile, orderId) : await uploadFileToVercel(uploadedFile, orderId);

		// Save the new file into our database
		// Make sure to notate which order the file is to be associated with
		const processedFile = await saveNewFile(fileBlob, orderId, uploader);
		await attachFileToOrder(processedFile.orderId, processedFile._id);

		return { success: true, file: processedFile };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function deleteFileFromOrder(data) {
	try {
		// Delete references of the file from the order
		await deleteOrderFile(data.orderId, data.fileId);

		// Delete Vercel's reference of the file from their Blob service as well as our back-end
		// In case we fail to properly delete the file for whatever reason, still notate the operation as a success
		// as the file's been detached from the order
		try {
			if (await deleteFile(data.fileId)) {
				await deleteFromVercel(data.fileUrl);
			}
		} catch (error) {
			console.error(error);
		}

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function fetchFilesByOrder(data) {
	try {
		const files = await getFilesByOrder(data.orderId);
		return { success: true, files: JSON.stringify(files) };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}