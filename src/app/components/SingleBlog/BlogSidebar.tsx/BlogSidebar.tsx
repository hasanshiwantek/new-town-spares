import RecentPost from "./RecentPost";
const BlogSidebar = () => {
  return (
    <>
      {/* Live: `.image-margin.col-md-3` — 25% wide, 10.5px side padding, margin-top 112px
          (which lines the sidebar up just under the post title + date) */}
      {/* Live keeps the sidebar visible below 768 — it stacks under the post, it isn't hidden */}
      <main className="flex flex-col md:w-[25%] w-full px-[10.5px] mt-[112px]">
        {/* <CategoriesSidebar /> */}
        <RecentPost />
        {/* <SupportTeam /> */}
      </main>
    </>
  );
};

export default BlogSidebar;
