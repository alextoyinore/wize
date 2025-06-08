import PaystackPop from '@paystack/inline-js'

export async function POST(request) {
    try {
        const body = await request.json()
        const { amount, email } = body

        const paystack = new PaystackPop()
        const response = await paystack.initiatePayment({
            amount,
            email,
            callbackUrl: 'http://localhost:3050/checkout/success',
            metadata: JSON.stringify({
                orderId: body.orderId
            })
        })  
    } catch (error) {
        console.error('Error processing payment:', error)
    }   
}

export async function GET(request) {
    try {
        const body = await request.json()
        const { amount, email } = body

        const paystack = new PaystackPop()
        const response = await paystack.initiatePayment({
            amount,
            email,
            callbackUrl: 'http://localhost:3050/checkout/success',
            metadata: JSON.stringify({
                orderId: body.orderId
            })
        })  
    } catch (error) {
        console.error('Error processing payment:', error)
    }   
}
