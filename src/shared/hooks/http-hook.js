import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
    const [isloading, setIsLoading] = useState(false);
    const [error , setError] = useState();

    //Uses useRef to keep track of active HTTP requests. This is useful for cancelling these requests if needed (e.g., when the component using this hook unmounts).
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, 
    headers = {}) => {
        setIsLoading(true);
        //using an AbortController to cancel the request if necessary.
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try{
            const response = await fetch(url, {
                method,
                body,
                headers,
                //for potential request cancellation.
                signal: httpAbortCtrl.signal
            });
    
            const responseData = await response.json();
            /*
                //When you initiate an HTTP request using the sendRequest 
                function, an AbortController is created for 
                that request and added to the activeHttpRequests 
                array. This controller can be used to abort the 
                request if necessary (for example, if the 
                component unmounts before the request completes).

                //Once the request is complete 
                (successfully or with an error), 
                there's no more need to keep its 
                associated AbortController in the 
                activeHttpRequests array. This line 
                of code removes the AbortController of 
                the completed request from the array. 
                This is important for cleanup and to 
                prevent memory leaks, as it avoids 
                keeping unnecessary references to 
                controllers that are no longer needed.

                //In summary, this line keeps the 
                activeHttpRequests array updated by 
                removing the AbortController of 
                each request once the request is finished.
            */

            //except the current request, all other requests are filtered and asigned to activeHttpRequest.current.
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);
            if(!response.ok){
                throw new Error(responseData.message);
            }
            setIsLoading(false);
            return responseData;
        }catch(err){
            setError(err.message || 'Something went wrong, please try again.');
            setIsLoading(false);
            throw err;
        }
    }, []);

    const errorHandler = () => {
        setError(null);
    };

    //for cleanup, abort all active http requests.
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return {isloading, error, sendRequest, errorHandler};
};