// app/my-account/page.tsx
import { redirect } from "next/navigation";

const page = () => {
  redirect("/my-account/orders"); // redirect to default tab
};

export default page;
