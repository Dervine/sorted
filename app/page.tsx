'use client';
import React, { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, MagnifyingGlassIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline' 
import { signIn } from 'next-auth/react';
import { HiOutlineRefresh } from 'react-icons/hi';

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
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await fetch('/api/apartments');
      if (!response.ok) {
        throw new Error('Failed to fetch apartments');
      }
      const data = await response.json();
      setApartments(data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      setError('Failed to fetch apartments');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    const result = await signIn('credentials', {
      email,
      password,
      apartment: selectedApartment,
      redirect: false,
    });

    if (!result.error) {
      // Successful sign-in, do something
      setSignInSuccess(true); 
      console.log('Signed in successfully');
    } else {
      // Failed sign-in, handle error
      console.error('Sign-in failed:', result.error);
      setError(result.error);
    }

    setLoading(false); // Reset loading state
  };

  const hideError = () => {
    setShowErrorDialog(false);
  };

  const hideSuccess = () => {
    setShowSuccessDialog(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleContactButtonClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setPhoneNumber(vendor.phone);
    setShowDialog(true);
  };
  
  const handleSendSMS = async () => {
    try {
      setSending(true);

      // Make the HTTP POST request to send the SMS
      const response = await fetch('/api/sendSMS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      });

      // Check if the request was successful
      if (response.ok) {
        setSuccess(true);
        setShowSuccessDialog(true);
        setShowDialog(false);
        setMessage('');
        setError('');
      } else {
        // If there was an error, parse the response and set the error state
        const data = await response.json();
        setSuccess(false);
        setShowErrorDialog(true);
        setError(data.message || 'Failed to send SMS');
      }
    } catch (error) {
      setSuccess(false);
      setError(error.message || 'Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetch('/api/vendors')
      .then((response) => response.json())
      .then((data) => setVendorsByCategory(data));
  }, []);

  return (
    <>
    {signInSuccess ? ( // Conditionally render the success message and hidden div
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
                      <p className="text-sm font-medium tracking-tight text-gray-900">Lifestyle Terraces</p>
  
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
            <div></div>
            {/* rest of page */}
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
                className="block w-full rounded-md border-0 py-2 pl-7 pr-20 text-gray-900 ring-0 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
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
                    {Array.isArray(vendors) && vendors.length > 0 ? (
                    vendors
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
                                <div className="bg-indigo-50 p-2 text-gray-700 rounded" key={vendor.products._id}>
                                  <p>{vendor.products.name}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-sm text-gray-500 dark:text-gray-300 leading-7">
                                <div>Delivery</div>
                                  <p>{vendor.vendor.delivery}</p>
                              </div>
                              <button
                                className="text-sm bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 mt-7 rounded"
                                onClick={() => handleContactButtonClick(vendor.vendor)}
                              >
                                Contact {vendor.vendor.name}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                      ) : (
                        <p className="text-sm text-gray-500 p-4">No vendors found</p>
                    )}
                  </div>
                  {(Array.isArray(vendors) && vendors.length > 3 && !searchQuery) && (
                    <div className="absolute bottom-0 right-0 -mb-4 mr-4">
                      <button
                        className="text-sm text-indigo-500 hover:underline"
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
        {showDialog && selectedVendor && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-xl w-full">
              <h2 className="text-lg font-semibold mb-4">Contact {selectedVendor.name}</h2>
              <textarea
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={6}
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-4 space-x-4">
                <button 
                  className="text-sm bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>
                <button 
                  className="text-sm bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                  onClick={handleSendSMS}
                  disabled={sending} 
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessDialog && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="sm:flex sm:items-start bg-white rounded-lg p-8 max-w-lg w-full items-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h2 className="text-lg font-semibold mb-4">Success</h2>
                <p>Your message has been sent successfully.</p>
              </div>
              <div className="flex justify-end mt-4 space-x-4">
                <button 
                  className="text-sm bg-indigo-500 hover:bg-indigo-700 text-white lg:mt-20 py-2 px-4 rounded"
                  onClick={hideSuccess}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        {showErrorDialog && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="sm:flex sm:items-start bg-white rounded-lg p-8 max-w-lg w-full items-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h2 className="text-lg font-semibold mb-4">Failed</h2>
                <p>Failed to send SMS.</p>
              </div>
              <div className="flex justify-end mt-4 space-x-4">
                <button 
                  className="text-sm bg-indigo-500 hover:bg-indigo-700 text-white lg:mt-20 py-2 px-4 rounded"
                  onClick={hideError}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="text-center">
                  <img className="mx-auto h-32 w-auto" src="/logo.svg" alt="Your Logo" />
                  <h2 className="-mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="apartment" className="sr-only">Apartment</label>
                      <select
                        id="apartment"
                        value={selectedApartment}
                        onChange={(e) => setSelectedApartment(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      >
                        <option value="">Select Apartment</option>
                        {apartments.map((apartment: any) => (
                          <option key={apartment._id} value={apartment._id}>{apartment.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="email" className="sr-only">Email address</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="sr-only">Password</label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className={`text-sm w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-semibold rounded-lg shadow-md flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading} // Disable button when loading
                    >
                      {loading ? (
                        <HiOutlineRefresh className="animate-spin w-5 h-5 mr-3 text-sm" /> // Show spinner icon when loading
                      ) : null}
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>

                {/* Error section */}
                {error && (
                  <div className="mt-4 p-2 bg-red-100 text-red-500 text-sm rounded">
                    Failed: Please check your credentials.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

    )}
  </>
  );
}
