import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Box, Button, Center, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { ChakraProvider } from '@chakra-ui/react'
import DATA from '../constants/DummyData'

export default function Home() {
  const headers = [
    'Timestamp',
    'Purchase Id',
    'Mail',
    'Name',
    'Source',
    'Status',
    'Select'
  ]

  return (
    <>
      <Box
        p={4}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <ChakraProvider>
        <DataTable
          headers={[
            'TIMESTAMP',
            'PURCHASE ID',
            'MAIL',
            'NAME',
            'SOURCE',
            'STATUS',
            'SELECT'
          ]}
          rows={DATA}
          caption="Bookings"
          sortable
          pagination={true}
        />
      </ChakraProvider>
      </Box>
    </>
  )
}
