import React from 'react'
import { Metadata } from 'next'
import ContactUs from '../components/ContactUs/ContactUs'

export const metadata: Metadata = {
  title: 'Contact Us | New Town Spares',
  description:
    'Get in touch with New Town Spares for product inquiries, customer support, sales questions, and technical assistance. Contact us via phone, email, or visit our website.',
  keywords: [
    'contact New Town Spares',
    'customer support',
    'sales inquiries',
    'IT hardware support',
    'New Town Spares contact',
  ],
  alternates: {
    canonical: 'https://newtownspares.advertsedge.com/contact-us',
  },
  openGraph: {
    title: 'Contact Us | New Town Spares',
    description:
      'Get in touch with New Town Spares for product inquiries, customer support, and sales questions.',
    url: 'https://newtownspares.advertsedge.com/contact-us',
    siteName: 'New Town Spares',
    images: [
      {
        url: '/contactus.png',
        width: 1200,
        height: 630,
        alt: 'Contact Us - New Town Spares',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | New Town Spares',
    description:
      'Get in touch with New Town Spares for product inquiries, customer support, and sales questions.',
    images: ['/contactus.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const page = () => {
  return (
    <div>
      <ContactUs/>
    </div>
  )
}

export default page

