import { Button, Card, CardBody, CardHeader, Center, ChakraProvider, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/auhtProvider'

export default function Register() {

    const [user, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const auht = useAuth()

    if (auht.isAuthenticated) {
        return <NavLink to="/dashboard" />
    }

    async function handlesSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    user,
                    password
                })
            });
            if (response.ok) {
                console.log("usuario registrado");
            } else {
                const errorData = await response.json();
                console.log("Error:", errorData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ChakraProvider>
            <Center>
                <Card align='center' width={500} h="100vh">
                    <CardHeader>
                        <Heading>Registrar usuario</Heading>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handlesSubmit}>
                            <FormControl>
                                <FormLabel>Ingrese su nombre</FormLabel>
                                <Input type='text' value={user} onChange={(e) => setUsername(e.target.value)} />
                                <FormErrorMessage>Error</FormErrorMessage>

                                <FormLabel>Ingrese su correo electónico</FormLabel>
                                <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                <FormErrorMessage>Error</FormErrorMessage>

                                <FormLabel>Ingrese su contraseña</FormLabel>
                                <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                <FormErrorMessage>Error</FormErrorMessage>

                                <Center marginTop={5}>
                                    <Button type='submit'>Registrar</Button>
                                </Center>

                                <Text textAlign="center" marginTop={5}>
                                    Ya tenes una cuenta?
                                    <Link>
                                        <NavLink to="/">Inicia sesión</NavLink>
                                    </Link>
                                </Text>
                            </FormControl>
                        </form>
                    </CardBody>
                </Card>
            </Center>
        </ChakraProvider>
    )
}