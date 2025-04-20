import React from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { useGetCreatorCoursesQuery } from '@/features/api/courseApi'
import { Badge } from '@/components/ui/badge'
import { Edit } from "lucide-react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const CourseTable = () => {
  const {data,isLoading} = useGetCreatorCoursesQuery();
  const navigate = useNavigate();

  if(isLoading) {
    return <p>Loading...</p>;
  }
  console.log(data);
  // Check if data is available and has courses
  return (
    <div>
      <Button onClick={() => navigate('create')} className="mb-4">
        {/* Button to create a new course */}
        Create a new Course
      </Button>
      {/* Table component to display courses */}
      <Table>
        <TableCaption>A list of your recent Courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Map through the courses and display each one in a table row */}
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course?.coursePrice || "N/A"}</TableCell>
              <TableCell><Badge>{course.isPublished ? "Published" : "Draft"}</Badge></TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => navigate(`${course._id}`)}><Edit/></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
export default CourseTable