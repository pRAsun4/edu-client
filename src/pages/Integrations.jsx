import { InnerLayout } from "../layout/InnerLayout";
import { SettingsNav } from "../components/Settings/SettingsNav";
import { FaPlug, FaEye, FaEyeSlash } from "react-icons/fa";
import Card from '../components/Settings/Card';
import { FormInput } from "../components/Form/FormInput";
import { useState, useEffect } from "react";
import { useQuery, updateMailgunConfig, createMailgunConfig, getMailgunConfig } from "wasp/client/operations";  // Wasp hooks for querying and mutating data

export const Integrations = ({ user }) => {
    const [mailgunForm, setMailgunForm] = useState({ apiKey: '', sendingEmail: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showApiKey, setShowApiKey] = useState(false); // State to toggle API key visibility

    // Fetch existing MailgunConfig based on orgId
    const { data: mailgunConfig, isMailgunLoading, isMailgunError } = useQuery(getMailgunConfig, { organizationId: user.organizationId });

    useEffect(() => {
        if (mailgunConfig) {
            // Pre-fill the form if a config already exists
            setMailgunForm({
                apiKey: mailgunConfig.apiKey,
                sendingEmail: mailgunConfig.sendingEmail
            });
        }
    }, [mailgunConfig]);

    const handleSaveMailgunConfig = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setMessage(null);

        try {
            // Check if no changes are made to the form
            if (
                mailgunConfig &&
                mailgunForm.apiKey === mailgunConfig.apiKey &&
                mailgunForm.sendingEmail === mailgunConfig.sendingEmail
            ) {
                setMessage({ type: 'info', text: 'No changes were made to the configuration.' });
                return; // Exit early if no changes
            }

            // Check if there is an existing MailgunConfig for the orgId
            if (mailgunConfig) {
                // If the MailgunConfig already exists, update it
                await updateMailgunConfig({ organizationId: user.organizationId, ...mailgunForm });
                setMessage({ type: 'success', text: 'Mailgun configuration updated successfully!' });
            } else {
                // If no config exists, save the new one
                await createMailgunConfig({ organizationId: user.organizationId, ...mailgunForm });
                setMessage({ type: 'success', text: 'Mailgun configuration saved successfully!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <InnerLayout Nav={SettingsNav} childHeader="Integrations" ChildIcon={FaPlug}>
            <div className="max-w-3xl mx-auto flex flex-col gap-5 w-full">
                <h3 className="h4">Integrations</h3>
                <Card cardTitle="Mailgun API">
                    <form onSubmit={handleSaveMailgunConfig} className="w-full">
                        <FormInput>
                            <label htmlFor="mailgun_api">Mailgun API Key</label>
                            <div className="relative w-full">
                                <input
                                    type={showApiKey ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                    id="mailgun_api"
                                    value={mailgunForm.apiKey}
                                    onChange={(e) =>
                                        setMailgunForm({ ...mailgunForm, apiKey: e.target.value })
                                    }
                                    required
                                    className="input !pr-10" // Add padding to the right for the eye icon
                                />
                                <span
                                    className="absolute right-2 top-0 h-full flex items-center cursor-pointer"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                >
                                    {showApiKey ? <FaEye /> : <FaEyeSlash />} {/* Toggle icons */}
                                </span>
                            </div>
                        </FormInput>
                        <FormInput>
                            <label htmlFor="mailgun_email">Mailgun From Email</label>
                            <input
                                type="email"
                                id="mailgun_email"
                                value={mailgunForm.sendingEmail}
                                onChange={(e) =>
                                    setMailgunForm({ ...mailgunForm, sendingEmail: e.target.value })
                                }
                                required
                                className="input"
                            />
                        </FormInput>
                        <button
                            type="submit"
                            className="btn btn-primary mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Mailgun Config'}
                        </button>
                    </form>
                    {message && (
                        <div
                            className={`mt-4 text-sm ${
                                message.type === 'success'
                                    ? 'text-green-600'
                                    : message.type === 'info'
                                    ? 'text-blue-600'
                                    : 'text-red-600'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                </Card>
            </div>
        </InnerLayout>
    );
};
