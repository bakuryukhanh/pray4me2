import Layout from "@/components/layout";
import { Button } from "antd";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
    <Layout>
      <div
        style={{
          marginInline: "auto",
          marginTop: "200px",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h1>404 - Page Not Found</h1>
        <Button type="primary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </Layout>
  );
}
