'use client'
import React from "react";
import { useAuthContext } from "../../authen/authContext";
import { useRouter } from "next/navigation";
const Admin = () => {
	console.log('kk', useAuthContext());
	
  const { user } = useAuthContext()
	// user k ton tai
    const router = useRouter()

    // React.useEffect(() => {
    //     if (user == null) router.push("/")
    // }, [user])

    return (<h1>Only logged in users can view this page</h1>);
};

export default Admin;
