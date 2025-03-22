import { createContext, useState } from "react";

export const FevriotContext = createContext()

export const FevriotProvider = ({ children }) => {
    // eslint-disable-next-line no-unused-vars
    const [favriot, setFavriot] = useState([])

    return <FevriotContext.Provider>
        {children}
    </FevriotContext.Provider>
}


