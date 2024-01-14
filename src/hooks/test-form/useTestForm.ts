import { useContactStore } from "@/stores/test";


const useTestForm = () => {
    const store = useContactStore();

    const fields = {
        firstName: {
            name: 'firstName'
        },
        lastName: {
            name: 'lastName'
        },
        email: {
            name: 'email'
        },
        "user.name": {
            name: 'user.name'
        },
    }
    return {
        ...store,
        fields
    }
}


export default useTestForm