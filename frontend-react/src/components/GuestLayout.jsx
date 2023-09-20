import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <>
      <div>
        For guest users only
        <Outlet />
      </div>
    </>
  );
}
