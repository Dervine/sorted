'use client';
import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline' 
import React from 'react';

const user = {
  name: 'LST User',
  email: 'lstuser@example.com',
  imageUrl:
    'https://www.bma.co.ke/wp-content/uploads/2016/07/lifestyle_terraces.jpg',
}
const userNavigation = [
  { name: 'Sign out', href: '#' },
]
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface Vendor {
  _id: string;
  name: string;
  phone: string;
  delivery: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
}

interface VendorProduct {
  vendor: Vendor;
  products: Product;
}

interface VendorsByCategory {
  [category: string]: VendorProduct[];
}

export default function Home() {
  const [vendorsByCategory, setVendorsByCategory] = useState<VendorsByCategory>({});
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetch('/api/vendors')
      .then((response) => response.json())
      .then((data) => setVendorsByCategory(data));
  }, []);

  return (
    <>
    <div className="min-h-full bg-white">
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center flex-shrink-0 lg:-ml-24">
                  <img
                    className="h-24 w-24"
                    src="/logo.svg"
                    alt="my soko app"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6 lg:-mr-20">
                    <p className="text-sm font-medium tracking-tight text-gray-900">Apartments</p>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <main className="bg-gray-200">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="p-4 mt-2 text-l font-medium tracking-tight text-gray-900">{user.name}</h1>
          <div className="p-4 relative rounded-md">
            <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">
              <MagnifyingGlassIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
              placeholder="Search for product/service or supplier..."
            />
          </div>

          <div>
            {Object.entries(vendorsByCategory).map(([category, vendors], index) => (
              <div key={category} className="relative">
                <div className="pl-4 mt-2 flex items-center text-sm text-gray-500">
                  {category}
                </div>
                <div className="flex flex-wrap">
                  {vendors
                    .filter((vendor) =>
                      vendor.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      vendor.products.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, showAll || searchQuery ? vendors.length : 3)
                    .map((vendor) => (
                      <div key={vendor.vendor._id} className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 p-4">
                        <div className="flex rounded-lg h-full dark:bg-gray-800 bg-white p-5 flex-col">
                          <div className="divide-y divide-gray-200">
                            <div className="flex items-center mb-2">
                              <h2 className="text-gray-700 dark:text-white text-sm font-medium">{vendor.vendor.name}</h2>
                            </div>
                            <div className="mb-4"></div>
                          </div>
                          <div className="flex flex-col justify-between flex-grow">
                            <div className="grid grid-cols-2 gap-1 text-sm text-gray-500 dark:text-gray-300 leading-7">
                              <div>Supplier Contact</div>
                              <div>{vendor.vendor.phone}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-sm text-gray-500 dark:text-gray-300 leading-7">
                              <div>Product/Service</div>
                              <div className="bg-blue-50 p-2 text-gray-700 rounded" key={vendor.products._id}>
                                <p>{vendor.products.name}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-sm text-gray-500 dark:text-gray-300 leading-7">
                              <div>Delivery</div>
                                <p>{vendor.vendor.delivery}</p>
                            </div>
                            <button className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 mt-7 rounded">
                              Order from {vendor.vendor.name}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {(vendors.length > 3 && !searchQuery) && (
                  <div className="absolute bottom-0 right-0 -mb-4 mr-4">
                    <button
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "Hide" : "Show All"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </>
  );
}
