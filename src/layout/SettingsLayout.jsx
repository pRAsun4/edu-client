import { Layout } from "../layout/Layout"
import { SettingsNav } from "../components/Settings/SettingsNav"

export const SettingsLayout = ({ children }) => {
    return (
        <Layout>
            <section className="mt-[100px] border-y border-black">
                <div className="container mx-auto">
                    <div className="flex  gap-10 min-h-screen">
                        <SettingsNav />
                        <div className="relative w-full py-10 px-5">
                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}