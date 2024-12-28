import { InnerLayout } from "../layout/InnerLayout";
import { FormInput } from '../components/Form/FormInput';
import Card from '../components/Settings/Card';
import { SiMinutemailer } from "react-icons/si";
import { SettingsNav } from "../components/Settings/SettingsNav";
import { useEffect, useState } from 'react';
import { TextEditor } from "../components/TextEditor";
import { useQuery, getEmailTemplate, createEmailTemplate,getMailgunConfig } from "wasp/client/operations";

export const Emails = ({ user }) => {
    const { data: template, isLoading, isError } = useQuery(getEmailTemplate, { organizationId: user.organizationId });
    const { data: mailgunConfig, isLoadingMailgun, isErrorMailgun } = useQuery(getMailgunConfig, { organizationId: user.organizationId });

    const [formData, setFormData] = useState({
        subject: '',
        body: '<p>Please provide your feedback!</p>',
        senderName: '',
        senderEmail: '',
        replyTo: '',
        footer: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (template) {
            setFormData({
                subject: template.subject || '',
                body: template.body || '<p>Please provide your feedback!</p>',
                senderName: template.senderName || '',      
                replyTo: template.replyTo || '',
                footer: template.footer || ''
            });
        }

        if(mailgunConfig){
            setFormData({
                ...formData,
                senderEmail: mailgunConfig.sendingEmail || '', // Update from mailgunConfig
            })
        }

    }, [template, mailgunConfig]);    

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await createEmailTemplate({
                organizationId: user.organizationId,
                ...formData
            });
            setMessage({ type: 'success', text: 'Template saved successfully!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to save template. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || isLoadingMailgun) {
        return (
            <InnerLayout Nav={SettingsNav} childHeader="Emails" ChildIcon={SiMinutemailer}>
                <div>Loading...</div>
            </InnerLayout>
        );
    }

    if (isError || isErrorMailgun) {
        return (
            <InnerLayout Nav={SettingsNav} childHeader="Emails" ChildIcon={SiMinutemailer}>
                <div>Error loading resource</div>
            </InnerLayout>
        );
    }

    return (
        <InnerLayout Nav={SettingsNav} childHeader="Emails" ChildIcon={SiMinutemailer}>
            <div className="max-w-3xl mx-auto flex flex-col gap-5 w-full">
                <Card cardTitle="Templates">
                    <form className="w-full" onSubmit={handleFormSubmit}>
                        <FormInput>
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData({ ...formData, subject: e.target.value })
                                }
                                required
                                className="input"
                            />
                        </FormInput>
                        <FormInput>
                            <label className="h6" htmlFor="body">
                                Body
                            </label>
                            <TextEditor
                                value={formData.body}
                                onChange={(newValue) =>
                                    setFormData({ ...formData, body: newValue })
                                }
                            />
                        </FormInput>
                        <button
                            type="submit"
                            className="btn btn-primary mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                    {message && (
                        <div
                            className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {message.text}
                        </div>
                    )}
                </Card>

                <Card cardTitle="Email Settings">
                    <form className="w-full" onSubmit={handleFormSubmit}>
                        <FormInput>
                            <label htmlFor="senderName">Sender Name</label>
                            <input
                                type="text"
                                id="senderName"
                                value={formData.senderName}
                                onChange={(e) =>
                                    setFormData({ ...formData, senderName: e.target.value })
                                }
                                required
                                className="input"
                            />
                        </FormInput>
                        <FormInput>
                            <label htmlFor="senderEmailAddress">Sender Email Address</label>
                            <input
                                type="text"
                                id="senderEmail"
                                value={formData.senderEmail}
                                readOnly
                                required
                                className="input"
                            />
                        </FormInput>
                        <FormInput>
                            <label htmlFor="replyTo">Reply To</label>
                            <input
                                type="text"
                                id="replyTo"
                                value={formData.replyTo}
                                onChange={(e) =>
                                    setFormData({ ...formData, replyTo: e.target.value })
                                }
                                required
                                className="input"
                            />
                        </FormInput>
                        <FormInput>
                            <label className="h6" htmlFor="footer">
                                Footer
                            </label>
                            <TextEditor
                                value={formData.footer}
                                onChange={(newValue) =>
                                    setFormData({ ...formData, footer: newValue })
                                }
                            />
                        </FormInput>
                        <button
                            type="submit"
                            className="btn btn-primary mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                    {message && (
                        <div
                            className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {message.text}
                        </div>
                    )}
                </Card>
            </div>
        </InnerLayout>
    );
};
