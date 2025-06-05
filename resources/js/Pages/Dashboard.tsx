import { Application } from "../Layout/Application"
import { ChartSection } from "@/components/chart-section"
import { OverviewSection } from "@/components/overview-section"


const Dashboard: React.FC = () => {


    return <Application>
        <OverviewSection />
        <ChartSection
            data={[{ value: 10, time: "4s ago" }, { value: 20, time: "2s ago" }, { value: 15, time: "now" }]}
            title="pH"
            desc="In catfish farming, maintaining the correct pH level is essential for fish health and growth. The ideal pH range for catfish is typically between 6.5 and 8.5. Water that is too acidic or too alkaline can cause stress, reduce immunity, and lead to poor feeding behavior. Real-time pH monitoring helps ensure that water conditions remain optimal for fish survival and productivity."
        />

        <ChartSection
            data={[{ value: 10, time: Date.now().toLocaleString() }]}
            title="TDS"
            desc="TDS (Total Dissolved Solids) represents the concentration of dissolved substances like minerals, salts, and organic matter in the pond. High TDS levels can indicate poor water quality, which may harm catfish by affecting their gills and metabolism. Monitoring TDS helps farmers manage water changes and feeding practices to maintain a healthy aquatic environment."
            reverse={true}
        />

        <ChartSection
            data={[{ value: 10, time: Date.now().toLocaleString() }]}
            title="Distance"
            desc="Distance sensors in catfish ponds are commonly used to measure water level or detect the presence of objects near feeders or drains. Monitoring water level helps prevent overflows and ensures consistent pond depth, which is important for fish comfort and effective oxygen distribution throughout the pond."
        />

        <ChartSection
            data={[{ value: 10, time: Date.now().toLocaleString() }]}
            title="Temperature"
            desc="Water temperature directly affects catfish metabolism, feeding behavior, and growth rate. If the water is too cold or too warm, it can stress the fish and make them more susceptible to disease. By monitoring temperature in real-time, farmers can take actions such as shading, aeration, or adjusting feeding times to create a stable and healthy environment."
            reverse={true}
        />


    </Application>
}

export default Dashboard