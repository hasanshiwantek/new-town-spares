"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "@/lib/api/category";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { subscribeNewsletter } from "@/redux/slices/contactSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { getWebPages } from "@/redux/slices/storeFrontSlice";
import { getBrands } from "@/redux/slices/homeSlice";
import { customerProfile, logout } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";
interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories?: Category[];
}
const poppinsFont = "Poppins, sans-serif";

const FooterBottom = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsToken = searchParams.get("token");
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState("");
  const auth = useAppSelector((state: RootState) => state?.auth);

  const [token, setToken] = useState<string | null>(null);

  const { newsletterLoading, newsletterSuccess, newsletterError } =
    useAppSelector((state: any) => state.contact);
  const { webPages, error, loading } = useAppSelector(
    (state: any) => state.storeFront,
  );
  const pagesList = webPages?.data || [];
  const visiblePages = pagesList?.filter((page: any) => !page.restrictToCustomersOnly || token)
    .filter((item: any) => item?.showInNavigation);
  const { getBrand } = useAppSelector(
    (state: any) => state.home
  );
  const handleSelect = (url: string) => {
    router.push(url);
  };
  const handleLogout = () => {
    const confirm = window.confirm("Confirm Logout?");
    if (!confirm) {
      return;
    } else {
      dispatch(logout());
      toast.success("Logged out successfully!");
      router.replace("/auth/login");
    }
  };
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data); // ✅ fill the variable
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []); // ✅ run once on mount
  useEffect(() => {
    const user = localStorage.getItem("persist:auth");
    const parsedAuth = user ? JSON.parse(user) : null;
    const t = parsedAuth?.token ? JSON.parse(parsedAuth.token) : null;
    setToken(t);
  }, []);
  useEffect(() => {
    dispatch(getWebPages({ page: 1, perPage: 100 }));
    dispatch(getBrands())
  }, [dispatch]);

  useEffect(() => {
    if (!paramsToken) return;
    const login = async () => {
      const auth = {
        token: JSON.stringify(paramsToken),
      };
      localStorage.setItem("persist:auth", JSON.stringify(auth));
      const result = await dispatch(customerProfile());
      if (customerProfile.fulfilled.match(result)) {
        // dispatch(fetchCartList());
        window.location.href = "/my-account/orders";
      }
    };
    login();
  }, [paramsToken, dispatch, router]);
  return (
    <React.Fragment>
      <div className="w-full">
        <footer className="bg-[#333333] text-white w-full mx-auto">
          {/* 🔹 Newsletter Section */}
          <section className="bg-[#2C2D2C] flex justify-center items-center h-auto min-h-[7.91rem]">
            <div
              className="
        w-full
        flex flex-col md:flex-row items-center justify-evenly gap-2 md:gap-8 lg:gap-0
      "
            >
              <div className="hidden md:block text-center  md:text-center">
                <h3 className="text-[19px] !text-white">
                  Subscribe to our Newsletter
                </h3>
                <p className="!text-[#FFFFFF] text-[14px]">
                  Get the latest updates on new products and upcoming sales
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) {
                    dispatch(subscribeNewsletter({ email: email.trim() }))
                      .unwrap()
                      .then(() => {
                        handleSelect("/result");
                        setEmail("");
                      });
                  }
                }}
                className="w-[400px] flex flex-col md:flex-row  items-center mt-4 md:mt-0 "
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className=" w-[240px] md:h-[44px] md:w-full px-4 py-3 border border-white !font-normal text-[#333] bg-white focus:outline-none text-sm md:text-base"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="btn-primary !mt-[6px] md:!bg-[#FD5430] !rounded-none h-[44px] text-[14px] !font-light !px-7 hover:!bg-[#FD5430] !text-white"
                >
                  {newsletterLoading ? "Loading" : "Subscribe"}
                </button>
              </form>
              <div></div>
            </div>
          </section>

          <section
            className="
      w-full max-w-full sm:max-w-[95%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[85%]
      2xl:max-w-[90%] 
      mx-auto 
      
      py-6 text-center sm:text-start
    "
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10"
              style={{ fontFamily: poppinsFont }}
            >
              {/* INFO */}
              <address className="not-italic text-[#FAFAFA] mt-3 sm:mt-0">
                <h4 className="text-[18px] font-noraml mb-4 ">Info</h4>

                <p className="mb-2 text-[14px]">Address :</p>

                <p className="text-[13px]">
                  MAILING ADDRESS: 1032 E BRANDON BLVD
                </p>
                <p className="text-[13px]">Suite 1124 BRANDON, FL 33511</p>

                <div className="h-4" />

                <p>CALIFORNIA ADDRESS: 440 N Barranca Ave</p>
                <p className="text-[13px]">Covina, CA 91723</p>

                <div className="h-12" />

                <p>orders@newtownspares.com</p>
                <p className="mt-4">Call us : (209) 651-6864</p>
              </address>

              {/* PAGES */}
              <nav>
                <h4 className="text-[18px] font-noraml text-[#FAFAFA] mb-4">
                  Pages
                </h4>
                <ul className="space-y-2 text-[#FAFAFA]">
                  {visiblePages?.map((page: any) => (
                    <li key={page.id}>
                      {page?.pageType == "2" ? (
                        <Link
                          href={page.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {page.pageName}
                        </Link>
                      ) : (
                        <Link
                          href={page.slugWithUrl}
                        >
                          {page.pageName}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li>
                    <Link href={'/sitemap'}>Sitemap</Link>
                  </li>
                </ul>
              </nav>

              {/* CATEGORIES */}
              <nav className="hidden lg:block">
                <h4 className="text-[18px] font-noraml text-[#FAFAFA] mb-4">
                  Categories
                </h4>

                <ul className="space-y-2 text-[#FAFAFA]">
                  {categories?.slice(0, 8).map((category) => (
                    <li key={category.id}>
                      <Link href={`/category/${category.slug}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* BRANDS */}
              <nav className="hidden lg:block">
                <h4 className="text-[18px] font-noraml text-[#FAFAFA] mb-4">
                  Brands
                </h4>
                <ul className="space-y-2 text-[#FAFAFA]">
                  {getBrand?.data?.slice(0, 8)?.map((item: any) => (
                    <li key={item?.brand?.id}>
                      <Link href={`/brand/${item?.brand?.slug || ""}`}>
                        {item?.brand?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* ACCOUNT */}
              <nav>
                <h4 className="text-[18px] font-noraml text-[#FAFAFA] mb-4">
                  Account
                </h4>

                <ul className="space-y-2 text-[#FAFAFA]">
                  {!auth?.isAuthenticated ? <>
                    <li>
                      <Link href="/auth/login">Sign In</Link>
                    </li>
                    <li>
                      <Link href="/auth/signup">Sign Up</Link>
                    </li>
                  </> : <>
                    <li>
                      <Link href="/my-account/orders">Account</Link>
                    </li>
                    <li>
                      <span onClick={handleLogout}>Logout</span>
                    </li>
                  </>}
                  <li>
                    <Link href="/cart">My Cart</Link>
                  </li>
                </ul>

                <h4 className="text-[18px] font-noraml text-[#FAFAFA] mt-12 mb-4">
                  Follow Us
                </h4>

                <div className="flex gap-2 sm:gap-2 items-center justify-center sm:justify-start">
                  {/* Facebook */}
                  <Link
                    href="#"
                    className="w-10 h-10 bg-white rounded flex items-center justify-center"
                  >
                    <svg viewBox="0 0 512 512" className="w-6 h-6">
                      <path
                        fill="#333333"
                        d="M352.00 512.00L255.99 512.00L255.99 336.51A0.51 0.51 0.0 0 0 255.48 336.00L192.50 336.00Q192.00 336.00 192.00 335.50L192.00 256.50A0.50 0.50 0.0 0 1 192.50 256.00L255.48 256.00Q255.98 256.00 255.98 255.50Q256.04 228.22 255.99 201.00Q255.96 187.66 256.77 181.02C262.20 136.96 296.36 101.83 340.83 96.75Q346.69 96.08 360.80 96.03Q388.16 95.94 415.51 96.03Q416.00 96.03 416.00 96.51L416.00 175.49Q416.00 175.98 415.51 175.98Q394.47 176.04 373.51 175.98C365.51 175.96 356.57 176.74 353.35 184.43Q352.02 187.59 352.01 196.21Q351.97 225.87 352.02 255.51Q352.02 256.00 352.50 256.00L431.32 256.00A0.43 0.42 10.7 0 1 431.72 256.58L400.17 335.40Q399.93 336.00 399.28 336.00L352.51 336.00Q352.00 336.00 352.00 336.51L352.00 512.00Z"
                      />
                    </svg>
                  </Link>

                  {/* LinkedIn */}
                  <Link
                    href="#"
                    className="w-10 h-10 bg-white rounded flex items-center justify-center"
                  >
                    <svg viewBox="0 0 512 512" className="w-6 h-6">
                      <path
                        fill="#333333"
                        d="M49.56 0.00L462.56 0.00C489.83 1.61 510.31 22.07 512.00 49.32L512.00 462.81C509.59 490.18 490.23 510.48 462.43 512.00L49.94 512.00C22.38 510.07 1.65 490.55 0.00 462.68L0.00 49.19C1.87 21.95 22.26 1.52 49.56 0.00ZM161.21 115.20A46.01 46.01 0.0 0 0 115.20 69.19A46.01 46.01 0.0 0 0 69.19 115.20A46.01 46.01 0.0 0 0 115.20 161.21A46.01 46.01 0.0 0 0 161.21 115.20ZM281.50 235.14L281.50 205.25Q281.50 204.75 281.00 204.75L205.25 204.75A0.50 0.50 0.0 0 0 204.75 205.25L204.75 434.75Q204.75 435.25 205.25 435.25L280.99 435.25Q281.50 435.25 281.50 434.74Q281.49 368.03 281.52 301.31C281.54 270.28 315.47 249.38 341.96 268.64Q358.50 280.66 358.50 303.51Q358.49 369.10 358.51 434.75Q358.51 435.25 359.01 435.25L434.73 435.25A0.51 0.51 0.0 0 0 435.24 434.74Q435.29 366.43 435.22 298.05Q435.21 284.10 434.41 278.09C427.03 222.73 365.24 181.03 312.78 208.36C300.26 214.89 289.69 223.55 281.82 235.24A0.18 0.17 62.1 0 1 281.50 235.14ZM153.50 205.01A0.26 0.26 0.0 0 0 153.24 204.75L77.02 204.75A0.26 0.26 0.0 0 0 76.76 205.01L76.76 434.99A0.26 0.26 0.0 0 0 77.02 435.25L153.24 435.25A0.26 0.26 0.0 0 0 153.50 434.99L153.50 205.01Z"
                      />
                    </svg>
                  </Link>

                  {/* Pinterest */}
                  <Link
                    href="#"
                    className="w-10 h-10 bg-white rounded flex items-center justify-center"
                  >
                    <svg viewBox="0 0 512 512" className="w-6 h-6">
                      <path
                        fill="#333333"
                        d="M66.81 0.00L445.55 0.00C482.34 3.04 509.83 29.95 512.00 66.82L512.00 445.55C509.51 482.38 481.49 509.85 444.68 512.00L67.93 512.00C30.48 509.74 2.04 482.50 0.00 444.93L0.00 66.20C2.65 29.51 29.99 2.76 66.81 0.00ZM236.04 304.90C247.60 321.38 266.71 328.26 286.45 326.88C351.77 322.29 381.53 255.90 379.59 198.73C377.70 143.35 332.96 102.74 279.25 97.02C217.99 90.50 153.67 120.37 136.17 183.28C126.89 216.62 132.88 264.58 169.26 280.69C174.51 283.02 177.61 280.81 179.08 275.51C180.39 270.80 185.13 257.64 181.75 253.53C172.41 242.23 168.32 231.53 168.07 216.52C167.03 155.05 223.21 116.50 281.58 129.82C309.12 136.11 328.58 155.02 333.55 183.10C337.39 204.84 333.20 230.46 325.87 251.15C318.07 273.22 299.43 298.40 272.56 295.16C256.16 293.19 243.38 277.80 247.46 260.99C250.43 248.77 254.33 236.89 257.75 224.80C262.32 208.69 269.87 185.88 254.80 172.69C246.38 165.33 232.85 166.21 224.02 171.67C200.90 185.97 200.10 221.08 209.33 243.29Q209.52 243.75 209.41 244.24Q197.96 292.75 186.52 341.26C180.93 364.92 181.72 390.08 185.39 413.89A2.27 2.27 0.0 0 0 188.32 415.71Q189.15 415.44 189.72 414.72C203.95 396.71 217.23 375.08 223.19 352.73Q229.55 328.92 235.49 305.00Q235.65 304.34 236.04 304.90Z"
                      />
                    </svg>
                  </Link>
                </div>
              </nav>
            </div>
          </section>

          {/* 🔹 Bottom Bar */}
          <div className="text-[14px] flex items-center flex-wrap sm:flex-nowrap justify-between bg-[#2C2D2C] min-h-[4.5rem] px-[5%]">
            {/* Center Content */}
            <p className="!text-white text-center sm:text-left w-full">
              &copy; {new Date().getFullYear()} New Town Spares Inc.
            </p>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default FooterBottom;
