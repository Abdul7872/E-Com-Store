"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z.string().min(3, { message: "Name must contain at least 3 character(s)"}),
  email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
  password: z.string().min(4, { message: "Password must contain at least 4 character(s)"}),
  confirmPassword: z.string().min(4, { message: "Password must contain at least 4 character(s)"}),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const URL= String(process.env.NEXT_PUBLIC_API_URL)?.split('/')?.slice(0,-1)?.join('/');
    try {
      setLoading(true);
      const response = await axios.post(`${URL}/auth/sign-up`, values);
      router.push('/sign-in');
      toast.success(response.data.message)
    } catch (error: any) {
      console.log("Sign-up error", error);
      toast.error(error?.response?.data ?? error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full antialiased bg-gradient-to-br from-green-100 to-white">
      <div className="p-2 w-full md:w-full lg:w-1/2 mx-auto md:mx-0">
        <div className="bg-white p-10 flex flex-col w-full shadow-xl rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 text-left mb-5">
            Signup
          </h2>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 space-x-2 flex items-center justify-between w-full">
                <div className="text-sm">Have an account? <Link prefetch={false} className="font-bold text-sm text-orange-500 hover:text-orange-800" href={'/sign-in'}>sign-in</Link></div>
                <Button disabled={loading} type="submit">Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
};
