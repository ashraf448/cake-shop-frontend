import { useState } from "react";
import { Button, MenuItem, Menu } from "@mui/material";
import useAuth from "../../zustand/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function UserDropMenu({ user }) {
  const logoutHandler = useAuth((s) => s.logoutHandler);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 🔴 Logout
  const signOut = async () => {
    await logoutHandler();
    handleClose();
    navigate("/login");
  };

  // 🟢 Go to Profile
  const goToProfile = () => {
    handleClose();
    navigate("/profile");
  };

  // 🟢 Go to Orders
  const goToOrders = () => {
    handleClose();
    navigate("/my-orders");
  };

  return (
    <div>

      <Button
        id="user-menu"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          textTransform: "capitalize",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        👋 Hi,{" "}
        <span className="ml-1 text-yellow-300">
          {user?.userName}
        </span>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "220px",
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >

        {/* PROFILE */}
        <MenuItem onClick={goToProfile}>
          👤 Profile
        </MenuItem>

        {/* ORDERS */}
        <MenuItem onClick={goToOrders}>
          📦 My Orders
        </MenuItem>

        {/* WISHLIST (اختياري) */}
        <MenuItem onClick={() => {
          handleClose();
          navigate("/wishlist");
        }}>
          ❤️ Wishlist
        </MenuItem>

        <hr className="my-2" />

        {/* LOGOUT */}
        <MenuItem
          onClick={signOut}
          sx={{ color: "red", fontWeight: "bold" }}
        >
          🚪 Logout
        </MenuItem>

      </Menu>

    </div>
  );
}