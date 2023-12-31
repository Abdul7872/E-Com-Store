"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import AddressForm from "./address";

const Summary = () => {
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [loading, setLoading] = useState(false)

  
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity
  }, 0);

  const onCheckout = async () => {
    setLoading(true);
    const body = {
      orderProducts: items.map(({ id,quantity }) => ({ id,quantity })),
      addressId: selectedAddressId
    }
    const response = await axios.post('/api/checkout', body);

    window.location = response.data.url;
    setLoading(false);
  }

  return ( 
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-6 lg:mt-0 lg:p-6" >
      <h2 className="text-lg font-medium text-gray-900">
        Order summary
      </h2>
      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>

      <AddressForm {...{selectedAddressId, setSelectedAddressId}}/>
      
      <Button onClick={onCheckout} disabled={items.length === 0 || !selectedAddressId || loading} className="w-full mt-6">
        Checkout
      </Button>
    </div>
  );
}

export default Summary;
