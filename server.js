require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())

const BASE_URL=process.env.BASE_URL;

const PORT= process.env.PORT || 3001;

const corsorgin={
    origin:`${BASE_URL}`
};
app.use(
    cors(corsorgin)
)

const key= process.env.STRIPE_KEY;
const stripe = require("stripe")(key);
app.post("/create-checkout-session", async (req, res)=>{
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items: req.body.items.map(item => {        // josn given to stripe
                return{
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name: item.name
                        },
                        unit_amount: (item.price)*100,

                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${BASE_URL}/success`,
            cancel_url: `${BASE_URL}/cancel`
        })

        res.json({url: session.url})

    }catch(e){
     res.status(500).json({error:e.message})
    }
})

app.listen(PORT,()=>{
    console.log("server is running");
})