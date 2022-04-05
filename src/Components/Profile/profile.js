import React from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
    
    // Get ID from URL
    const params = useParams();

  console.log(params);
  return (
    <div>
      <p> {params['id']}</p>
    </div>
  );
}

export default Profile;