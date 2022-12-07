import Layout from "@/components/layout";
import Main from "@/components/layout/Main";
import { prisma } from "@/server/db/client";

function App(props) {
  const originItems = props.items.map((item) => ({
    ...item,
    ItemStatus: item.ItemStatus.map((itemStatus) => ({
      ...itemStatus,
      index: new Date(itemStatus.index),
    })),
  }));
  return (
    <Layout>
      <Main initialItems={originItems} initialStatusArr={props.statusArr} />
    </Layout>
  );
}

// export async function getServerSideProps() {
//   const initialItems = await prisma?.item.findMany({
//     include: {
//       ItemStatus: true,
//       status: true,
//       category: true,
//       users: true,
//     },
//   });
//   const initialStatusArr = await prisma?.status.findMany();

//   const formattedItems = initialItems?.map((items) => {
//     return {
//       ...items,
//       ItemStatus: items.ItemStatus.map((itemStatus) => {
//         return {
//           ...itemStatus,
//           index: itemStatus.index.getTime(),
//         };
//       }),
//     };
//   });
//   return {
//     props: {
//       items: formattedItems,
//       statusArr: initialStatusArr,
//     },
//   };
// };

export default App;
