import {
    createClient,
    createRequest,
    defaultExchanges,
    subscriptionExchange
} from "@urql/core";
import { pipe, subscribe } from "wonka";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { createRoute, routeUpdate } from "./queries.js";
import { drawMap } from "./map.js";
import { polyline } from "./polyline.js";

function displayData(data) {
    document.getElementById("distance").innerHTML = (data.distance / 1000);
    document.getElementById("stops").innerHTML = data.charges;
    document.getElementById("duration").innerHTML = ((data.duration / 3600).toFixed(0));
    document.getElementById("charge-duration").innerHTML = ((data.chargeTime / 60).toFixed(0));
    document.getElementById("consumption").innerHTML = (data.consumption).toFixed(2);
    document.getElementById("cost").innerHTML = data.saving.money;
    document.getElementById("co2").innerHTML = (data.saving.co2 / 1000);
};

const headers = {
    "x-client-id": "5e8c22366f9c5f23ab0eff39"
};

const subscriptionClient = new SubscriptionClient(
    "wss://api.chargetrip.io/graphql", {
        reconnect: true,
        connectionParams: headers
    }
);

const client = createClient({
    url: "https://api.chargetrip.io/graphql",
    fetchOptions: {
        method: "POST",
        headers
    },
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription(operation) {
                return subscriptionClient.request(operation);
            }
        })
    ]
});

/*
 * 1. Create a new route and receive back its ID
 * 2. Subscribe to route updates in order to receive its details
 */
client
    .mutation(createRoute)
    .toPromise()
    .then(response => {
        const routeId = response.data.newRoute;
        console.log("Route ID:", routeId);

        const { unsubscribe } = pipe(
            client.executeSubscription(createRequest(routeUpdate, { id: routeId })),
            subscribe(result => {
                const { status, route } = result.data.routeUpdatedById;
                console.log("Route status:", status);
                console.log("Route data:", route);

                // you can keep listening to the route changes to update route information
                // for this example we want to only draw the initial route
                if (status === "done" && route) {
                    const data = result.data.routeUpdatedById.route;
                    const decoded = polyline.decode(data.polyline);
                    let reversed = decoded.map(function reverse(item) {
                        return Array.isArray(item) && Array.isArray(item[0]) ?
                            item.map(reverse) :
                            item.reverse();
                    });
                    const legs = data.legs;
                    drawMap(reversed, legs);
                    displayData(data);
                    unsubscribe();
                }
            })
        );
    })
    .catch(error => console.log(error));