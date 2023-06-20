import {
    Chip,
    Input,
    Button,
    Typography,
    Select,
    Option
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"
import ReactLoading from "react-loading";

export function UploadBill() {

    const navigate = useNavigate()
    const { id, bill_id } = useParams();
    const [ details, setDetails ] = useState({bill_id:bill_id,date:new Date(),project_id:id})
    const [ isloading, setIsloading ] = useState(false)
    useEffect(() => {
        console.log(id,bill_id);
        document.title = "Manager | Upload Bill"
        if(bill_id)
        {
            fetch("http://localhost:3000/getBillDetailsbyid",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({bill_id,project_id:id})
            }).then(res => res.json())
            .then(data => {
                setDetails(data)
            }).catch(err => console.log(err))
        }
        else{
            fetch("http://localhost:3000/getlatestbillid",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({project_id:id})
            }).then(res => res.json())
            .then(data => {
                setDetails({...details,bill_id:data})
            }).catch(err => console.log(err))
        }
        console.log(details);
    },[])

    const handleChange = (e) => {
        if(typeof(e) == "string"){
            setDetails({
                ...details,
                bill_type : e
            })
        }
        else{
            const { name, value } = e.target;  
            let updatedDetails = {
                ...details,
                [name]: value
            };

            if (name === "amount" && details.gst_percent) {
                updatedDetails = {
                ...updatedDetails,
                gst_amount: (parseFloat(value) * details.gst_percent) / 100,
                total: Number.parseInt(value) + Number.parseInt(value * details.gst_percent) / 100
                };
            }

            if (name === "gst_percent" && details.amount) {
                updatedDetails = {
                ...updatedDetails,
                gst_amount: (details.amount * parseFloat(value)) / 100,
                total: Number.parseInt(details.amount) + Number.parseInt(details.amount * value) / 100
                };
            }

            setDetails(updatedDetails);
            console.log(details);
        }
    }

    const handleFileChange = (e) => {
        setDetails({
            ...details,
            [e.target.name] : e.target.files[0]
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsloading(true)
        if(typeof(details.bill_copy)!="string"){
            const formData = new FormData();
            formData.append("project_id",id);
            formData.append("billType",details.bill_type);
            formData.append("document",details.bill_copy);
            await fetch('https://envirron.unijactech.com/upload.php', {
                method: 'POST',
                body: formData,
            }).then(res => {
                console.log(res);
                if(res.status == 200)
                return res.json();
                else
                throw new Error('Error uploading file: ' + res.status);
            }).then(data => {
                fetchAll(data.filename);
                setIsloading(false)
            }).catch(error => {
                setIsloading(false)
                console.log('Error:', error);
            });
        }
        fetchAll(details.bill_copy)
    }

    const fetchAll = (filename) => {
        console.log(filename);
        console.log(details);
        fetch("http://localhost:3000/billupload",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({...details,bill_copy : filename,project_id:id})
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.success)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Bill Uploaded Successfully',
            }).then(() => navigate(`../home`))
            else
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        }).catch(err => {
            setIsloading(c => !c)
            console.log(err)})
    }

    return ( 
        <>
        <div className="flex justify-center">
        <div className="w-full text-center">
        <Typography variant="h4" color="blue-gray">
          {!bill_id ? "Upload New Bill" : "Update Bill"}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter Bill details to Upload.
        </Typography>
        </div>
    </div>
    <div className="flex flex-col justify-center items-center">
        <label className="">Bill Id</label>
        <Chip variant="ghost" value={details.bill_id} className="flex justify-center" />
    </div>
    <div className="w-full mt-10">
          <div className="mb-4 w-full grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-5">
            <Select
                label="Select BillType"
                animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
                }}
                name="bill_type"
                onChange={handleChange}
            >
            <Option value="gst">GST</Option>
            <Option value="non-gst">NON GST</Option>
            </Select>
            <Input size="lg" label={details.bill_type == "gst" ? "Type of Materials" : "Type of Materials Or Workers"} name="particulars" onChange={handleChange} value={details.particulars} />
            <Input size="lg" label="Contractor Name" name="contractor_name" onChange={handleChange} value={details.contractor_name} />
            { details.bill_type == "gst" &&
            <>
                <Input size="lg" label="Bill Number" name="bill_no" onChange={handleChange} value={details.bill_no} />
                <Input size="lg" label="Amount Without GST" name="amount" onChange={handleChange} value={details.amount} />
                <Input size="lg" label="GST In %" name="gst_percent" onChange={handleChange} value={details.gst_percent} />
                <Typography variant="h6">GST In ₹ {details.gst_amount}</Typography>
                <Typography variant="h6">Total ₹ {details.total}</Typography>
            </>
            }   
            { details.bill_type == "non-gst" &&
                <Input size="lg" label="Total Amount" name="total" onChange={handleChange} value={details.total} />
            }   
            <Input size="lg" label="Paid Amount" name="paid_amount" onChange={handleChange} value={details.mode||0} />
            <Input size="lg" label="Mode Of Payment" name="mode" onChange={handleChange} value={details.mode} />
            <input type="file" name="bill_copy"  className="file-input file-input-bordered file-input-info file-input-sm w-full max-w-xs" onChange={handleFileChange} />
            </div>
          <div className="w-full flex justify-center">
          {isloading ? <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"/>
            : <Button className="mt-6" onClick={handleSubmit}>
                {bill_id ? "Update Bill" : "Upload New Bill"}
            </Button>
            }
          </div>
    </div>
    </>
     );
}
