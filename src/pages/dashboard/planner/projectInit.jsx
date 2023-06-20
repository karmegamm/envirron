import { Route,Routes } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FolderPlusIcon } from "@heroicons/react/24/solid"
import { Projects } from "../manager/projects";

export function ProjectInit() {
    return ( 
        <>
        <div className="flex justify-end">
            <Link to={"/dashboard/new"}>
                <Button variant="gradient" className="flex" >
                    <FolderPlusIcon className="mr-2 h-5 w-5" /> 
                    <span>Create Project</span>
                </Button>
            </Link>
        </div>
        <Projects />
        </>
    );
}