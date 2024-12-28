import React, { useEffect, useState } from 'react';
import { InnerLayout } from '../layout/InnerLayout';
import { SettingsNav } from '../components/Settings/SettingsNav';
import { IoIosColorPalette } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/Form/FormInput';
import { GoPlus } from 'react-icons/go';
import { RxCross1 } from 'react-icons/rx';
import ExpertLogo from '../assets/customers/expert-mri/expert-logo.jpg'
import { createLogo, getMedia, useQuery } from 'wasp/client/operations';

export default function Appearance({ user }) {
    const { data: appLogo, isLoading, isError } = useQuery(getMedia,{organizationId: user.organizationId, usage:'LOGO'});
    // console.log(user, "user");
    
    const [activeModal, setActiveModal] = useState(false);
    const [file, setFile] = useState(null);
    const [logoHeight, setLogoHeight] = useState(120); // Default height in pixels
    const [logoColor, setLogoColor] = useState('#000000'); // Default primary color
    const [colorBox, setColorBox] = useState('#000000'); // Sync with logoColor
    const [fileError, setFileError] = useState('');

    useEffect(() => {
        if (appLogo) {
            setFile(appLogo.file);
            // setLogoColor(appLogo.color);
            // setColorBox(appLogo.color);
            // setLogoHeight(appLogo.height);
        }
    }, [appLogo]);

    const handleTextChange = (e) => {
        const value = e.target.value;
        setLogoColor(value);
        setColorBox(value);
    };

    const handleColorChange = (e) => {
        const value = e.target.value;
        setColorBox(value);
        setLogoColor(value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
    
        // Check if the file is valid
        if (selectedFile) {
            const fileSizeLimit = 2 * 1024 * 1024; // 2MB limit
            const validExtensions = ['image/jpeg', 'image/png', 'image/svg+xml'];
    
            if (!validExtensions.includes(selectedFile.type)) {
                setFileError('Invalid file type. Only JPG, PNG, and SVG are allowed.');
                return;
            }
    
            if (selectedFile.size > fileSizeLimit) {
                setFileError('File size exceeds 2MB.');
                return;
            }
    
            let url = URL.createObjectURL(selectedFile)
            setFile(url); // Save the Blob in the state
            setFileError('');
        }
    };    

    const handleSave = async (e) => {
        e.preventDefault();
    
        if (!file) {
            setFileError('Please upload a logo.');
            return;
        }
    
        try {
            const formData = new FormData();
            // Append the Blob (the file) to the FormData
            formData.append('file', file); // 'logo.png' is the filename to send
            
            // Append other form data if needed
            formData.append('name', 'App Logo');
            formData.append('usage', 'LOGO');
            formData.append('organizationId', user.organizationId);
            console.log(formData)
            // Send the FormData to the server
            const response = await createLogo(formData); // Assuming createLogo is adjusted for FormData
            
            alert('Logo saved successfully!');
        } catch (error) {
            console.error('Error saving logo:', error);
            alert('Failed to save logo. Please try again.');
        }
    };    
    
    const handleClearFile = () => {
        setFile(null);
        setFileError('');
    };

    const renderUploader = (id, label, fileState, handleChange, handleClear) => (
        <FormInput className="w-auto">
            <label htmlFor={id} className={`${id}-label`}>{label}</label>
            <div className="uploader w-[140px] p-2 rounded-[3px] h-full flex items-center justify-center relative border">
                <div className="uploader-body w-[120px] h-[120px] overflow-hidden flex items-end justify-center relative">
                    <input
                        type="file"
                        id={id}
                        onChange={handleChange}
                        className="opacity-0 absolute w-full !border-none !rounded-none !p-0 !bg-none !h-full m-0 left-0 top-0 cursor-pointer"
                    />
                    {!fileState && (
                        <div className="uploader-loader flex w-full h-full justify-center items-center bg-[#4444]">
                            <GoPlus size={24} />
                        </div>
                    )}
                    {fileState && <img src={fileState} alt={label} className="preview-image absolute left-0 top-0 w-full h-full object-contain" />}
                    {fileState && (
                        <span
                            className="absolute top-1 right-1 cursor-pointer z-10 border"
                            onClick={handleClear}
                        >
                            <RxCross1 size={20} />
                        </span>
                    )}
                </div>
            </div>
            {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
            <div className="captions">
                {label === 'Logo' ? (
                    <span>max: 2MB<br />min size: 100px<br />max size: 2000px</span>
                ) : (
                    <span>1:1, max: 2MB<br />min size: 100px<br />max size: 2000px</span>
                )}
            </div>
        </FormInput>
    );

    return (
        <InnerLayout Nav={SettingsNav} childHeader="Appearance" ChildIcon={IoIosColorPalette}>
            <div className="w-full h-full flex max-w-3xl flex-col">
                <div className="w-full flex flex-col rounded-md border card-bg">
                    <div className="w-full p-6 border-b">
                        <Link to="/appearance#branding" className="h5 font-medium">Appearance</Link>
                    </div>
                    <div className="w-full flex items-start md:justify-start justify-between sm:flex-row flex-col gap-6 p-6">
                        {renderUploader('logo-input', 'Logo', !file && ExpertLogo, handleFileChange, handleClearFile)}
                    </div>
                    <div className="w-full flex flex-col items-start justify-start px-6 pt-0 pb-6">
                        <FormInput className="md:w-1/2 w-full">
                            <label htmlFor="logo-height" className="logo-height-label">Logo Height (in px)</label>
                            <div className="w-full flex rounded-r-md rounded-l-sm border">
                                <input
                                    type="number"
                                    id="logo-height"
                                    value={logoHeight}
                                    onChange={(e) => setLogoHeight(e.target.value)}
                                    className="!border-none p-2 rounded w-full !bg-transparent"
                                    min="100"
                                    max="2000"
                                />
                                <span className="flex items-center justify-center p-2 border-l">Pixels</span>
                            </div>
                            <div className="captions">
                                <span>The height of the logo on emails and pages.</span>
                            </div>
                        </FormInput>

                        <FormInput className="md:w-1/2 w-full">
                            <label htmlFor="logo-color" className="logo-color-label">Primary Color</label>
                            <div className="w-full flex relative">
                                <input
                                    type="text"
                                    id="logo-color"
                                    value={colorBox}
                                    onChange={handleTextChange}
                                    className="w-auto h-10 !rounded-none p-2 !bg-transparent"
                                />
                                <div className="absolute right-0 top-0 w-[4rem] p-2 h-full rounded-md overflow-hidden">
                                    <input
                                        type="color"
                                        value={logoColor}
                                        onChange={handleColorChange}
                                        className="w-full !h-full block !bg-transparent !rounded-md !border-none cursor-pointer !p-0"
                                    />
                                </div>
                            </div>
                        </FormInput>
                    </div>
                    <div className="w-full flex justify-center sm:justify-end items-center px-6 py-5 border-t">
                        <button onClick={handleSave} className="btn btn-outline">Save</button>
                    </div>
                </div>
            </div>
        </InnerLayout>
    );
}
