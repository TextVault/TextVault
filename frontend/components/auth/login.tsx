'use client';

import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { loginUser } from "@/actions/auth.action";

export const Login = () => {
    const router = useRouter();

    const initialValues: LoginFormType = {
        username: "",
        password: "",
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('token') !== null;

        if (isLoggedIn) {
            router.replace("/my");
            return;
        }

    }, [router]);

    const handleLogin = useCallback(
        async (values: LoginFormType) => {
            try {
                const response = await loginUser(values.username, values.password);

                localStorage.setItem('token', response.token);
                localStorage.setItem('username', response.username);

                toast.success('Login successful');
                router.replace("/");

            } catch (error) {
                toast.error((error as Error).message);
            }
        },
        [router]
    );

    return (
        <>
            <div className='text-center text-[25px] font-bold mb-6'>Login</div>

            <Formik
                initialValues={initialValues}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}>
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                    <>
                        <div className='flex flex-col w-1/2 gap-4 mb-4'>
                            <Input
                                variant='bordered'
                                label='Username'
                                type='text'
                                value={values.username}
                                isInvalid={!!errors.username && !!touched.username}
                                errorMessage={errors.username}
                                onChange={handleChange("username")}
                                autoComplete='off'
                            />
                            <Input
                                variant='bordered'
                                label='Password'
                                type='password'
                                value={values.password}
                                isInvalid={!!errors.password && !!touched.password}
                                errorMessage={errors.password}
                                onChange={handleChange("password")}
                                autoComplete='off'

                            />
                        </div>

                        <Button
                            onPress={() => handleSubmit()}
                            variant='flat'
                            color='primary'>
                            Login
                        </Button>
                    </>
                )}
            </Formik>

            <div className='font-light text-slate-400 mt-4 text-sm'>
                Don&apos;t have an account ?{" "}
                <Link href='/register' className='font-bold'>
                    Register here
                </Link>
            </div>
        </>
    );
};