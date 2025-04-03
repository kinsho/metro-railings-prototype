'use client'

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import dayjs from 'dayjs';

import FileUpload from 'components/admin/FileUpload';
import Notes from 'components/admin/Notes';
import OptionSet from 'components/admin/OptionSet';
import { filterOrders } from 'app/admin/order-search/orderFilter';

import { buildUserMap } from 'lib/userInfo';

import styles from 'public/styles/page/orderSearch.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faUserTag, faLocationDot, faSquareEnvelope, faSquarePhone, faPencil } from '@fortawesome/free-solid-svg-icons';

const OrderSearchPage = ({ jsonOrders, jsonStatuses }) => {

	const searchParams = new useSearchParams();
	const orders = useMemo(() => JSON.parse(jsonOrders), [jsonOrders]);
	const [filteredOrders, setFilteredOrders] = useState(filterOrders(orders, {
		status: searchParams.get('status') || '',
		search: searchParams.get('search') || ''
	}));
	const [filters, setFilters] = useState({
		status: searchParams.get('status') || '',
		search: searchParams.get('search') || '',
		page: 1,
		maxPage: Math.ceil(filteredOrders.length / 10) // Used to determine how many times we can render new data for infinite scroll
	});
	const [userMap, setUserMap] = useState({});

	const pathName = usePathname();
	const observerTarget = useRef(null);
	const router = useRouter();
	const statuses = JSON.parse(jsonStatuses);

	const updateStatusFilter = (newStatus) => {
		const newFilters = {
			...filters,
			status: newStatus,
			page: 1
		};
		const newlyFilteredOrders = filterOrders(orders, newFilters);

		setFilters({
			...newFilters,
			maxPage: Math.ceil(newlyFilteredOrders.length / 10)
		});
		setFilteredOrders(newlyFilteredOrders);

		updateQueryParams(newFilters.status, newFilters.search);
	};

	const updateSearchFilter = (event) => {
		const newFilters = {
			...filters,
			search: event.currentTarget.value,
			page: 1
		};
		const newlyFilteredOrders = filterOrders(orders, newFilters);

		setFilters({
			...newFilters,
			maxPage: Math.ceil(newlyFilteredOrders.length / 10)
		});
		setFilteredOrders(newlyFilteredOrders);

		updateQueryParams(newFilters.status, newFilters.search);
	};

	// A function to update the query parameters any time filters are updated
	const updateQueryParams = (status, search) => {
		let queryParams = [];
		
		if (status) {
			queryParams.push('status=' + status);
		}
		if (search) {
			queryParams.push('search=' + search);
		}

		window.history.pushState({}, "", pathName + (queryParams.length ? '?' + queryParams.join('&') : ''));
	};

	const generateGoogleLink = (customer) => {
		const params = (customer.address ? customer.address.trim().split(' ').join('+') : '') +
			(customer.city ? customer.city.trim().split(' ').join('+') : '') +
			(customer.state || '');

		return (params ? 'https://www.google.com/maps/search/?api=1&query=' + params : '#');
	}

	const generatePhoneNumber = (customer) => {
		if (customer.areaCode && customer.phoneOne && customer.phoneTwo) {
			return 'tel:' + customer.areaCode + customer.phoneOne + customer.phoneTwo;
		}

		return '#';
	}

	const navigateToOrderDetails = (orderId) => {
		router.push('/admin/order-details?id=' + orderId);
	}

	useEffect(() => {
		// Observer to allow for infinite scrolling so that more orders are only loaded once the user scrolls down far enough
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					setFilters((prevState) => {
						return {
							...prevState,
							page: (prevState.page < prevState.maxPage ? prevState.page + 1 : prevState.page)
						}
					});
				}
			},{ threshold: 0.5 });
		const observedNode = observerTarget?.current || null;

		if (observedNode) {
			observer.observe(observedNode);
		}

		return () => {
			if (observedNode) {
				observer.unobserve(observedNode);
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [observerTarget]);

	useEffect(() => {
		const userLoader = async () => {
			if (Object.keys(userMap).length === 0) {
				const users = await buildUserMap();
				setUserMap(users);
			}
		}
		userLoader();

		// Refresh the page whenever we navigate to ensure the page always contains the latest data
		router.refresh();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className={ styles.pageContainer }>
				<div className={ styles.pageButtonSection }>
					<Link href='/admin/order-details' prefetch={ true } passHref>
						<button className={ styles.createOrderButton }>Create Order</button>
					</Link>
				</div>

				<hr className={ styles.sectionDivider }></hr>

				<div className={ styles.filterSection }>

					<div className={ styles.filterRow }>
						<span className={ styles.filterLabel }>Status</span>
						<OptionSet
							labels={ statuses.map(status => status.label) }
							values={ statuses.map(status => status.key) }
							currentValue={ filters.status }
							isDisabled={ false }
							setter={ updateStatusFilter }
						/>
					</div>

					<div className={ styles.filterRow }>
						<span className={ styles.filterLabel }>Search</span>
						<span className={ styles.filterInputGrouping }>
							<input
								id='order_search_text_field'
								type='text'
								className={ styles.orderSearchField }
								onChange={ updateSearchFilter }
								placeholder={ 'Search orders using customer information' }
								value={ filters.search }
							/>
							<span className={ styles.orderSearchFieldIcon }>
								<FontAwesomeIcon
									icon={ faCircleXmark }
									onClick={() => { updateSearchFilter({ currentTarget: { value: '' }}); }}
								/>
							</span>
						</span>
					</div>
				</div>

				<hr className={ styles.sectionDivider }></hr>

				<div className={ styles.ordersListing }>
					{ filteredOrders.slice(0, filters.page * 10).map((order, index) => {
						return (
							<div id={ 'order_box_' + index } key={ 'order_' + order._id } className={ styles.orderBox } >
								<div className={ styles.orderBoxInfoBody }>

									<span className={ styles.orderBoxGeneralInfoColumn }>
										<div className={ styles.orderBoxId }>{ order._id }</div>
										<div className={ styles.orderBoxStatus }>{ order.status }</div>
									</span>

									<span>
										<div className={ styles.orderBoxCustomerInfoHeader }>Customer Info</div>
										<div className={ styles.orderBoxCustomerInfoSubColumn }>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faUserTag } />
												<span>
													{ order.customer.company ? (
														<div className={ styles.orderBoxCompanyName }>{ order.customer.company }</div>
													) : null }
													<div>{ order.customer.name }</div>
												</span>
											</div>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faLocationDot } />
												<Link target='_blank' href={ generateGoogleLink(order.customer) } passHref>
													{ order.customer.address || '--' }
													<br />
													{ (order.customer.city || '--') + ', ' + (order.customer.state || '--') }
												</Link>
											</div>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faSquareEnvelope } />
												<span>
													{ order.customer.email.length > 0 ? order.customer.email.map((email, index) => {
														return (
															<div key={ order._id + '-email' + index }>{ email }</div>
														)
													}) : '--' }
												</span>
											</div>

											<div className={ styles.orderBoxDatum }>
												<FontAwesomeIcon className={ styles.orderBoxIcon } icon={ faSquarePhone } />
												<a href={ generatePhoneNumber(order.customer) }>
													{ '(' + (order.customer.areaCode || '---') + ') ' + (order.customer.phoneOne || '---') + '-' + (order.customer.phoneTwo || '----') }
												</a>
											</div>

										</div>
									</span>

									<span>
										<div className={ styles.orderBoxMiscHeader }>Miscellaneous</div>
										<div className={ styles.orderBoxCustomerInfoSubColumn }>

											{ order.sales.header ? (
												<div className={ styles.orderBoxMiscelleneousDatum }>
													<div className={ styles.orderBoxMiscelleneousLabel }>Project Header</div>
													<div>{ order.sales.header }</div>
												</div>
											) : null }

											<div className={ styles.orderBoxMiscelleneousDatum }>
												<div className={ styles.orderBoxMiscelleneousLabel }>Created:</div>
												<div>{ dayjs(order.dates.created).format('MM/DD/YY') + (order.users?.creator ? ' (' + order.users.creator + ')' : '')}</div>
											</div>

											{ order.dates?.lastModified ? (
												<div className={ styles.orderBoxMiscelleneousDatum }>
														<div className={ styles.orderBoxMiscelleneousLabel }>Last Updated:</div>
														<div>{ dayjs(order.dates.lastModified).format('MM/DD/YY') + (order.users?.lastModifier ? ' (' + order.users.lastModifier + ')' : '')}</div>
												</div>
											) : null }

											{ order.dates?.due ? (
												<div className={ styles.orderBoxMiscelleneousDatum }>
													<div className={ styles.orderBoxMiscelleneousLabel }>Due Date:</div>
													<div>{ dayjs(order.dates.due).format('MM/DD/YY') }</div>
												</div>
											) : null }

											{ order.sales.assignees.length ? (
												<div className={ styles.orderBoxMiscelleneousDatum }>
													<div className={ styles.orderBoxMiscelleneousLabel }>Managers</div>
													{ order.sales.assignees.map((assignee, index) => {
														return (
															<div key={ order._id + '-salesman' + index }>{ userMap[assignee.username] }</div>
														);
													})}
												</div>
											) : null }

										</div>
									</span>
								</div>

								<div className={ styles.orderBoxButtonRow }>
									<button type='button' className={ styles.orderBoxActionButton } onClick={ () => navigateToOrderDetails(order._id) }>
										<FontAwesomeIcon icon={ faPencil } />
										Edit
									</button> 
								</div>

								<div className={ styles.orderBoxFileUpload }>
									<FileUpload
										order={ order }
										fileRefs={ order.files }
										inSpanish={ false }
									/>
								</div>

								<div className={ styles.orderBoxNotes }>
									<Notes
										order={ order }
										noteRefs={ order.notes }
										inSpanish={ false }
										specialNotes={ [...(order.tasks || []), ...(order.shopNotes || [])] }
									/>
								</div>
							</div>
						);
					})}
				</div>

				<hr className={ styles.sectionDivider } ref={ observerTarget }></hr>
			</div>

		</>
	);
};

export default OrderSearchPage;