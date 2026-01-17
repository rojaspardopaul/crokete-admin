import React, { useContext } from "react";
import Switch from "react-switch";

//internal import
import useGetCData from "@/hooks/useGetCData";
import AdminServices from "@/services/AdminServices";
import { SidebarContext } from "@/context/SidebarContext";
import { notifyError, notifySuccess } from "@/utils/toast";

const ActiveInActiveButton = ({ id, status, option, staff }) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const { role } = useGetCData();
  const handleChangeStatus = async (id, staff) => {
    if (staff?.email === "admin@gmail.com") {
      return notifyError("Actualización no permitida!");
    }
    // return notifyError("This option disabled for this option!");
    if (!(role === "super admin" || role === "admin"))
      return notifyError('Solamente "Super Admin" y "Admin" pueden realizar esta acción.');
    try {
      let newStatus;
      if (status === "activo") {
        newStatus = "inactivo";
      } else {
        newStatus = "activo";
      }
      const res = await AdminServices.updateStaffStatus(id, {
        status: newStatus,
      });
      setIsUpdate(true);
      notifySuccess(res.message);
      return;
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  return (
    <>
      <Switch
        onChange={() => handleChangeStatus(id, staff)}
        checked={status === "activo" ? true : false}
        className="react-switch md:ml-0"
        uncheckedIcon={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: 120,
              fontSize: 14,
              color: "white",
              paddingRight: 22,
              paddingTop: 1,
            }}
          ></div>
        }
        width={30}
        height={15}
        handleDiameter={13}
        offColor="#E53E3E"
        onColor={"#2F855A"}
        checkedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 73,
              height: "100%",
              fontSize: 14,
              color: "white",
              paddingLeft: 20,
              paddingTop: 1,
            }}
          ></div>
        }
      />
    </>
  );
};

export default ActiveInActiveButton;
