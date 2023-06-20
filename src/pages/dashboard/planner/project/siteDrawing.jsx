import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Typography,
  } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2"
import { isAdmin } from "../../../../util/utils"

export function SiteDrawing() {

    const { id } = useParams();

    const [ isloading, setIsloading ] = useState(false)
    const [ details, setDetails ] = useState({project_id: id})
    const [ head, setHead ] = useState(["Project name", "drawing Type", "View", "Download"]);
    const [ data, setData ] = useState([]);
    const [ clicked, setClicked ] = useState(false);
    const [ isadmin, setIsadmin ] = useState(isAdmin())

    useEffect(() => {
        document.title = "Site Drawing | Planner Dashboard";
        fetch("http://localhost:3000/getdrawingdetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ project_id: id }),
        }).then((res) => res.json())
        .then((data) => {
            setData(data)
        }).catch(err => console.log(err))
    },[clicked])

    useEffect(() => {        
      if(isadmin)
      head.push("Delete")
    },[])


    const handleFileChange = (e) => {
        setDetails({
            ...details,
            document : e.target.files[0]
        })
        console.log(details);
    }

    const planSubmit = (e) => {
        e.preventDefault();
        setIsloading(true)
        const formdata = new FormData()
        formdata.append("project_id",id)
        details.drawing_type = "Plan Drawing"
        formdata.append("document",details.document)
        upload(formdata)
    }
    
    const structuralSubmit = (e) => {
        e.preventDefault();
        details.drawing_type = "Structural Drawing"
        const formdata = new FormData()
        formdata.append("project_id",id)
        formdata.append("document",details.document)
        upload(formdata)
    }
    
    const upload = (formdata) => {
        fetch('https://envirron.unijactech.com/upload.php', {
            method: 'POST',
            body: formdata,
        }).then(res => {
            if (res.ok)
              return res.json();
            else
              throw new Error('Error uploading file: ' + res.status);
        }).then(data => {
            setIsloading(false)
            details.filename = data.filename
            fetchAll()
        }).catch(error => {
            console.log('Error:', error);
        });
    }

    const fetchAll = () => {
        console.log(details);
        fetch("http://localhost:3000/drawing",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
        }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            if(data.success)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Drawing Uploaded Successfully',
            })
            setIsloading(false)
            setClicked(c => !c)
        }
        ).catch(err => console.log(err))
    }

    const downloadFile = (filename,drawing_type) => {
      const formdata = new FormData()
      formdata.append("filename",filename)
      formdata.append("project_id",id)
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
        a.download = `${drawing_type}.jpeg`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
    }

    const handleDelete = (filename) => {
      fetch("http://localhost:3000/deletetablebyfield",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({table : "drawing", field : "filename" , id : filename}),
      }).then((res) => res.json())
      .then((data) => {
        Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Drawing Deleted Successfully',
        })
        setClicked(c => !c)
      }).catch(err => console.log(err))
    }

    return ( 
        <>
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 mt-10 gap-10 md:gap-0">
        <Card className="relative top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Plan Drawing
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
              <input type="file" name="plandrawing"  className="file-input file-input-bordered file-input-info file-input-sm w-full max-w-xs" onChange={handleFileChange} />
          </CardBody>
          <CardFooter className="pt-0">
            {isloading ? <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"/>
            : <Button variant="gradient" fullWidth onClick={planSubmit}>
                Upload Plan Drawing
            </Button>}
          </CardFooter>
        </Card>         
        <Card className="relative top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
            Structural Drawing
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
              <input type="file" name="structdrawing"  className="file-input file-input-bordered file-input-info file-input-sm w-full max-w-xs" onChange={handleFileChange} />
          </CardBody>
          <CardFooter className="pt-0">
            {isloading ? <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"/>
            : <Button variant="gradient" fullWidth onClick={structuralSubmit}>
                Upload Structural Drawing
            </Button>}
          </CardFooter>
        </Card>         
        </div>
        <Card className="mt-10">
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
                Drawing List
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[...new Set(head)].map((el) => (
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
                {data.map(
                  ({projectname, project_id, drawing_type, filename }, key) => {
                    // console.log(filename);
                    const className = `py-3 px-5 ${
                      key === data.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={filename}>
                        <td className={`${className} cursor-pointer`}>
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold text-pink-200"
                            >
                            {projectname}
                            </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {drawing_type}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            className="text-xs font-semibold text-blue-gray-600"
                            >
                            <label htmlFor={filename} className="btn">View</label>
                            <input type="checkbox" id={filename} className="modal-toggle" />
                            <div className="modal w-full h-full">
                            <div className="modal-box relative">
                                <label htmlFor={filename} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                                <img src={`https://envirron.unijactech.com/uploads/${project_id}/${filename}`} alt={drawing_type} className="w-full h-auto" />
                            </div>
                            </div>
                          </Typography>
                        </td>
                        <td className={className} onClick={() => downloadFile(filename,drawing_type)}>
                          <Typography
                            className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                          >
                            Download
                          </Typography>
                        </td>
                        {isadmin && <td className={className} onClick={() => handleDelete(filename)}>
                          <Typography
                          onClick={() => handleDelete(filename)}
                          className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                          >
                            Delete
                          </Typography>
                        </td>}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        </>
     );
}