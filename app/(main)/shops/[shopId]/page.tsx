import Booking from "@/components/ui/shop/Booking";
import React from "react";

interface PageProps {
  params: Promise<{
    shopId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { shopId } = await params;
  return (
    <div>
      <Booking shopId={shopId} />
    </div>
  );
};

export default Page;
