import { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Chip,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
} from "@material-tailwind/react";
import { Link, Routes, Route, useParams } from "react-router-dom"
import { FormatDate, isAdmin, doFilter } from "../../../../util/utils";
import { FolderPlusIcon } from "@heroicons/react/24/solid"
import Swal from "sweetalert2"
import { useSearch } from "../../../../context/searchContext";

export function GstBills() {

    const { id } = useParams();
    const [ bills, setBills ] = useState([]);
    const [ billType, setBillType ] = useState();
    const [ refresh,setRefresh ] = useState(false)
    const [ head, setHead ] = useState([]);
    const [ isadmin , setIsadmin ] = useState(isAdmin())
    const [ details, setDetails ] = useState({});
    const [ filterData, setFilterData ] = useState([]);
    const { searchQuery } = useSearch();

    useEffect(()=>{
      setFilterData(doFilter(bills,searchQuery))
    },[searchQuery])

    useEffect(() => {
      fetch(`http://localhost:3000/getprojectbyid`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({project_id:id})
        }).then(res => res.json())
        .then(data => setDetails(data))
        .catch(err => console.log(err))
    },[])
    
    useEffect(() => {
      var billType;
      document.title = "GST Bills | Manager"
      const url = window.location.href.split('/').pop()
      if(url.includes('non-gst-bills')){
        setBillType('non-gst')
          billType = 'non-gst'
          setHead(['SL No','Date', 'Contractor Name', 'Particulars', 'Total', 'Payment Status', 'Download'])
        }
        else if(url.includes('gst-bills')){
          setBillType('gst')
          billType = 'gst'
          setHead(['SL No','Date', 'Contractor Name', 'Bill no', 'Particulars', 'Amount', 'GST', 'GST Amount', 'Total', 'Payment Status', 'Download'])
        }
        fetch(`http://localhost:3000/getbills`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({project_id:id, bill_type:billType})
        }).then(res => res.json())
        .then(data => {
            setFilterData(data)
            setBills(data)
            console.log(data);
            console.log(bills);
        })
        .catch(err => console.log(err))
    },[window.location.href,refresh])

    useEffect(() => {
      if (isadmin) {
        setHead(prevHead => [...prevHead, 'Edit', 'Delete']);
      }
    }, [isadmin,window.location.href]);

    const handleDelete = (bill_id,filename) => {
      console.log(filename);
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          const formdata = new FormData();
          formdata.append("path",`${id}/${billType}/${filename}`)
          fetch("https://envirron.unijactech.com/delete.php",{
            method: 'POST',
            body: formdata        
          }).then(res => {
            console.log(res);
            if(res.ok)
            return res.json()
            else
            throw new Error('Error uploading file: ' + res.status);
          }).then(data => {
            fetch(`http://localhost:3000/deletetablebyfield`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({table:id+"_bills",field:"bill_id",id:bill_id})
            }).then(res => res.json())
            .then(data => {
              if(data){
                Swal.fire(
                  'Deleted!',
                  'Bill has been deleted.',
                  'success'
                  )
                setRefresh(c => !c)
              }
            }).catch(err => console.log(err))
          }).catch(err => console.log(err))
          }
        })
    }

    const updatePayment = (pending,bill_id,paid_amount) => {
      console.log(pending,bill_id,paid_amount,id);
      Swal.fire({
        title: 'Enter the pending amount to paid',
        input: 'number',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Update Payment',
        showLoaderOnConfirm: true,
        preConfirm: (amount) => {
          if(amount>pending){
              Swal.showValidationMessage("Amount must be less than or Equal to pending Amount..")
          }
          else{
            return fetch("http://localhost:3000/updatebillpayment",{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({project_id:id,amount:Number(amount)+Number(paid_amount),bill_id})
            }).then(res => res.json())
            .catch(err => Swal.showValidationMessage(
              `Request failed: ${err}`
            ))
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Payment Updated Successfully",
            text: "Success",
          })
          setRefresh(c => !c)
        }
      })
    }

    const handleDownload = (filename) => {
      const formdata = new FormData()
      formdata.append("filename",filename)
      formdata.append("project_id",id)
      formdata.append("billType",billType)
      fetch('https://envirron.unijactech.com/download.php', {
        method: 'POST',
        body: formdata,
      })
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error('File download failed.');
        }
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.jpeg`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
    }

    const handleReport = () => {
      const date = new Date();
        if(date.toISOString()>=data.to && data.from<=date.toISOString() && details.startat<=data.from && data.to>=details.startat){
          fetch(`http://localhost:3000/generatereport`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({project_id:id, bill_type:billType, from: data.from, to:data.to })
          }).then(res => {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
            return res.json();
          }
          return res.blob()
        })
        .then(data => {
          if(data instanceof Blob){
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
          }
          else
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message
          })
        }).catch(err => console.log(err))
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please select a valid date range'
        })
      }
      setOpen(c => !c)
    }
    
    const [ open, setOpen ] = useState(false)
    const [ data, setData ] = useState([])

    const handleOpen = () => {
      setOpen(c => !c)
    }

    const handleChange = (e) => {
      setData({...data, [e.target.name]: e.target.value})
    }

    return (
        <>
        <div className="flex justify-end">
            <Link to={`../uploadbill`}>
                <Button variant="gradient" className="flex mr-5" >
                    <FolderPlusIcon className="mr-2 h-5 w-5" /> 
                    <span>Upload New Bill</span>
                </Button>
            </Link>
            <Button variant="gradient" color='green' className="flex" onClick={handleOpen}>
              <FolderPlusIcon className="mr-2 h-5 w-5" /> 
              <span>Get Report</span>
            </Button>
            <Dialog
              size="xs"
              open={open}
              handler={handleOpen}
              className="bg-white shadow-none"
            >
              <DialogHeader>
                <Typography variant="h6">Enter Starting and Ending date</Typography>
              </DialogHeader>
              <DialogBody className='grid grid-cols-1 gap-5'>
                <Input label="Starting date" type="date" name="from" onChange={handleChange}/>
                <Input label="Ending Date" type="date" name="to" onChange={handleChange}/>
                <Button variant="gradient" color='green' className="flex" onClick={handleReport}>Submit</Button>
              </DialogBody>
            </Dialog>
        </div>
        <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Projects Table
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {head.map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filterData.map(
                  ({date, bill_no, bill_id, particulars, contractor_name, bill_copy, amount, gst_percent, gst_amount, total, paid_amount }, key) => {
                    const className = `py-3 px-5 ${
                      key === filterData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={bill_id}>
                        <td className={className}>
                            <Typography>{key+1}</Typography>
                        </td>
                        <td className={className}>
                            <Typography>{FormatDate(date)}</Typography>
                        </td>
                       <td className={className}>
                            <Typography>{contractor_name || "----"}</Typography>
                        </td>
                        {billType=="gst" && <td className={`${className} cursor-pointer`}>
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold text-pink-200"
                            >
                            {bill_no}
                            </Typography>
                        </td>}
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {particulars}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        {billType=="gst" && <><td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {amount}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {gst_percent}%
                          </Typography>
                        </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {gst_amount}
                          </Typography>
                        </td></>}
                        <td className={className}>
                          <Typography
                            className="text-xs font-semibold text-blue-gray-600"
                            >
                            {total}
                          </Typography>
                        </td>
                        <td className={className+`${billType=='gst'? ' ': ' w-40'}`}>
                          {total-paid_amount == 0 ? <><Chip color="green" size="sm" value="Paid" /><Typography className="text-xs font-semibold text-blue-gray-600">Pending : {total-paid_amount}</Typography><Typography className="text-xs font-semibold text-blue-gray-600">Paid : {paid_amount}</Typography></>
                          : <><Chip color="red" className='cursor-pointer' size="sm" value="Pending" onClick={() => updatePayment(total-paid_amount,bill_id,paid_amount)}/><Typography className="text-xs font-semibold text-blue-gray-600">Pending : {total-paid_amount}</Typography><Typography className="text-xs font-semibold text-blue-gray-600">Paid : {paid_amount}</Typography></>}
                        </td>
                        <td className={className+" cursor-pointer"} onClick={()=>handleDownload(bill_copy)}>
                          <Typography
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            Download
                          </Typography>
                        </td>
                        {isadmin && <><td className={className}>
                        <Link to={`../uploadbill/${bill_id}`}>
                          <Typography
                            className="text-xs font-semibold text-blue-gray-600"
                            >
                            Edit
                          </Typography>
                        </Link>
                        </td>
                        <td className={className+" cursor-pointer"} onClick={()=>handleDelete(bill_id,bill_copy)}>
                          <Typography
                            className="text-xs font-semibold text-blue-gray-600"
                            >
                            Delete
                          </Typography>
                        </td></>}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
    </div>
    </>
     );
}