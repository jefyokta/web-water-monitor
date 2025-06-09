import { List } from "@/components/list";
import { Application } from "@/Layout/Application"
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";


const Configuration = () => {

    const { kVal, calibration, distance} = usePage<ConfigProps>().props
    const [data, setData] = useState<{ calibration: number; distance: number, password: string }>({
        calibration,
        distance: distance,
        password: ""
    });
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingTds, setLoadingTds] = useState<boolean>(false)

    const [tdsData, setTdsData] = useState<{ kValue: number; kTemp: number, password?: string }>({ kValue: kVal, kTemp: 0 })
    const submit = async () => {
        setLoading(true)
        const result = await fetch("/esp", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        });
        if (result.ok) {
            toast("Configuration Changed")
        } else {

            const json = await result.json()
            toast.error(json.message)
        }
        setLoading(false)
    }

    const submitTds = async () => {
        setLoadingTds(true)
        const result = await fetch("/tds", {
            method: "POST",
            body: JSON.stringify(tdsData),
            headers: {
                "content-type": "application/json"
            }
        });
        if (result.ok) {
            toast("Configuration Changed")
        } else {

            const json = await result.json()
            toast.error(json.message)
        }
        setLoadingTds(false)

    }

    return <Application>
        <section className="flex gap-5">
            <div className="bg-sky-50 flex flex-col flex-1 rounded-4xl p-5 space-y-5 ">
                <div className=" space-y-3">
                    <p className="text-neutral-600">pH & Distance</p>
                    <div className="flex flex-col gap-5">

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <label htmlFor="calibration">Calibration</label>
                                <input
                                    type="number"
                                    id="calibration"
                                    value={data.calibration}
                                    onChange={(e) =>
                                        setData({ ...data, calibration: parseFloat(e.target.value) })
                                    }
                                    className="border border-slate-200 rounded-md p-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <label htmlFor="distance">
                                    Base to Ultrasonic Sensor Distance
                                </label>
                                <input
                                    type="number"
                                    id="distance"
                                    value={data.distance}
                                    onChange={(e) =>
                                        setData({ ...data, distance: parseFloat(e.target.value) })
                                    }
                                    className="border border-slate-200 rounded-md p-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="border border-slate-200 rounded-md p-1"
                                    value={data.password}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <button
                                    disabled={loading}
                                    className="w-full rounded-md bg-zinc-800 text-white p-1 cursor-pointer"
                                    onClick={async () => await submit()}
                                    type="button"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-sky-50 flex  flex-1 rounded-4xl p-5 gap-5 ">
                <div className=" space-y-3">
                    <p className="text-neutral-600">pH & Distance</p>
                    <div className="flex flex-col gap-5">

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <label htmlFor="Kval">Current ppm should be: <span className="text-zinc-400 text-sm">eg :(707) ppm</span></label>
                                <input
                                    type="number"
                                    id="kVal"
                                    value={tdsData.kValue}
                                    onChange={(e) =>
                                        setTdsData({ ...tdsData, kValue: parseFloat(e.target.value) })
                                    }
                                    className="border border-slate-200 rounded-md p-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <label htmlFor="kTemp">
                                    Current Temperature
                                </label>
                                <input
                                    type="number"
                                    id="kTemp"
                                    value={tdsData.kTemp}
                                    onChange={(e) =>
                                        setTdsData({ ...tdsData, kTemp: parseFloat(e.target.value) })
                                    }
                                    className="border border-slate-200 rounded-md p-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <label htmlFor="passwordtds">Password</label>
                                <input
                                    type="password"
                                    id="passwordtds"
                                    className="border border-slate-200 rounded-md p-1"
                                    value={tdsData.password}
                                    onChange={(e) => setTdsData({ ...tdsData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="grid flex-1 gap-2">
                                <button
                                    disabled={loadingTds}
                                    className="w-full rounded-md bg-zinc-800 text-white p-1 cursor-pointer"
                                    onClick={async () => await submitTds()}
                                    type="button"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#cce5e4]  rounded-4xl  p-5 flex flex-col justify-between">
                    <div>

                        <h3 className="text-lg">Realtime Data</h3>
                        <p className="text-sm text-neutral-600">
                            Sensors data that sending immediately by ESP32
                        </p>
                    </div>
                    <ul>
                        <List valueBefore={(() => 0)()} name="Dissolved Solid" value={(() => 0)()} unit="ppm" />
                        <List valueBefore={(() => 0)()} name="Temperature" value={(() => 0)()} unit="c" />
                    </ul>

                </div>
            </div>
        </section>

    </Application>

}

export default Configuration