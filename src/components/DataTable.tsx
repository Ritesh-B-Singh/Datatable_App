import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  Box,
  Badge,
  Tfoot,
  Text,
  Select
} from '@chakra-ui/react'
import { useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'

interface DataTableProps {
  headers: string[]
  rows: (string | React.ReactNode)[][]
  caption?: string
  sortable?: boolean
  pagination?: boolean
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  caption,
  sortable,
  pagination
}) => {
  const [isSorted, setIsSorted] = useState<boolean>(false)
  const [sortKey, setSortKey] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const handleSort = (key: string) => {
    setIsSorted(true)
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const renderPageNumbers = () => {
    if (!pagination) return null

    const MAX_VISIBLE_PAGES = 4
    const pageNumbers = []
    let startPage = 1
    let endPage = totalPages

    if (totalPages > MAX_VISIBLE_PAGES) {
      const halfVisiblePages = Math.floor(MAX_VISIBLE_PAGES / 2)
      startPage = Math.max(currentPage - halfVisiblePages, 1)
      endPage = startPage + MAX_VISIBLE_PAGES - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(endPage - MAX_VISIBLE_PAGES + 1, 1)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          size="sm"
          variant={i === currentPage ? 'solid' : 'outline'}
          mx={1}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      )
    }

    return (
      <Box display="flex" justifyContent="center">
        {startPage > 1 && (
          <Button
            size="sm"
            variant="outline"
            mx={1}
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>
        )}
        {startPage > 2 && <Text mx={1}>&hellip;</Text>}
        {pageNumbers}
        {endPage < totalPages - 1 && <Text mx={1}>&hellip;</Text>}
        {endPage < totalPages && (
          <Button
            size="sm"
            variant="outline"
            mx={1}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </Button>
        )}
      </Box>
    )
  }

  const getColor = (cell: string) => {
    switch (cell) {
      case 'Failed':
        return '#FEB2B2'
      case 'Waiting':
        return '#FEFCBF'
      case 'Paid':
        return '#9AE6B4'
      default:
        return 'gray.200'
    }
  }

  const sortedRows =
    sortable && sortKey
      ? [...rows].sort((a, b) => {
          const aValue = a[headers.indexOf(sortKey)]
          const bValue = b[headers.indexOf(sortKey)]
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }

          return 0
        })
      : rows

  const filteredRows = sortedRows.filter(
    (row) => !statusFilter || row[row.length - 1]?.toString() === statusFilter
  )
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRows = filteredRows.slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const styles = {
    table: {
      borderCollapse: 'separate',
      borderSpacing: '0 10px',
      width: '100%'
    },
    row: {
      borderBottom: '1px solid gray'
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Table variant={'simple'} sx={styles.table}>
        {caption && (
          <TableCaption placement="top" textAlign="left">
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Text fontWeight={'bold'} fontFamily={'mono'} fontSize={'20px'}>
                {caption}
              </Text>
              <Box display={'flex'} flexDirection={'row'}>
                <Text fontWeight={'bold'} fontFamily={'mono'} fontSize={'16px'}>
                  Status Filter:
                </Text>
                <Select
                  value={statusFilter || ''}
                  onChange={(event) => {
                    setStatusFilter(event.target.value || null)
                    setCurrentPage(1)
                  }}
                >
                  <option value="">All</option>
                  <option value="Failed">Failed</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Paid">Paid</option>
                </Select>
              </Box>
            </Box>
          </TableCaption>
        )}
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th
                key={index}
                onClick={() => sortable && handleSort(header)}
                borderBottom="1px"
                borderColor="gray.400"
                cursor={sortable ? 'pointer' : 'default'}
                textAlign="left"
                fontSize={'14px'}
                fontWeight={'bold'}
                fontFamily={'mono'}
                _hover={{
                  background: 'gray.300',
                  cursor: sortable ? 'pointer' : 'default'
                }}
                width="auto"
              >
                {header}
                {header == 'TIMESTAMP' && isSorted && (
                  <Box as="span">
                    {sortOrder === 'asc' ? (
                      <ArrowDownIcon boxSize={3} ml={2} />
                    ) : (
                      <ArrowUpIcon boxSize={3} ml={2} />
                    )}
                  </Box>
                )}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {(pagination ? currentRows : filteredRows).map((row, rowIndex) => (
            <Tr key={rowIndex} borderBottom="1px" borderColor="gray.400">
              {row.map((cell, cellIndex) => (
                <Td
                  key={cellIndex}
                  fontWeight={'bold'}
                  fontFamily={'mono'}
                  fontSize={'16px'}
                  color={'GrayText'}
                  width="auto"
                >
                  {cell && cellIndex == row.length - 1 ? (
                    <Badge
                      colorScheme="gray"
                      borderRadius="18px"
                      p={'0.2rem 0.7rem'}
                      fontSize={'14px'}
                      fontWeight={'bold'}
                      bg={getColor(cell.toString())}
                    >
                      {cell}
                    </Badge>
                  ) : (
                    cell
                  )}
                </Td>
              ))}
              <Td>
                <Button
                  fontWeight={'bold'}
                  fontSize={'16px'}
                  fontFamily={'mono'}
                  border={'none'}
                  color={'#4A5568'}
                  borderRadius={'4px'}
                  size="sm"
                >
                  Select
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {pagination && (
        <Box
          mt={4}
          display="flex"
          gap={4}
          justifyContent="center"
          alignItems={'center'}
        >
          <Button
            size="sm"
            onClick={goToPreviousPage}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Box mt={0}>{renderPageNumbers()}</Box>
          <Button
            size="sm"
            onClick={goToNextPage}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default DataTable
