import React, { useContext } from "react";
import { userContext } from "../../../context/userContext";
import styled from "styled-components";

const MainProfile = styled.div`
  h3{
    font-size: 18px;
    font-weight: 400;
    color: #626262;
    width: 150px;
  }
  h2{
    font-size: 22px;
    font-weight: 600;
    color: #4a4a4a;
  }
`;
const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const Profile = () => {
  const { userData } = useContext(userContext);
  return (
    <div>
      <h4 style={{ fontSize: "30px", color: "#032140", fontWeight: 700, marginBottom: "30px", }} >
        Account Information <span style={{fontSize:"16px", color:"#767676"}}>(Non Editable)</span>
      </h4>
      <MainProfile>
        <ProfileRow>
          <h3>Name: </h3>
          <h2>{userData?.name}</h2>
        </ProfileRow>
        <ProfileRow>
          <h3>Email: </h3>
          <h2>{userData?.email}</h2>
        </ProfileRow>
        <ProfileRow>
          <h3>Role: </h3>
          <h2>{userData?.role}</h2>
        </ProfileRow>
      </MainProfile>
    </div>
  );
};

export default Profile;
