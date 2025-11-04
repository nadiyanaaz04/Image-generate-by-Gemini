import React, { useState } from 'react';
import { analyzeText, analyzeImage } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';

const AnalyzeEdit: React.FC = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
            setResult('');
            setError('');
        }
    };

    const handleAction = async (action: 'summarize' | 'proofread' | 'describe') => {
        if (isLoading) return;
        setIsLoading(true);
        setResult('');
        setError('');

        try {
            let response = '';
            if (action === 'describe') {
                if (!image) {
                    setError('Please upload an image to describe.');
                    return;
                }
                response = await analyzeImage('Describe this image in detail.', image);
            } else {
                if (!text.trim()) {
                    setError('Please enter some text to analyze.');
                    return;
                }
                const prompt = action === 'summarize' ? 'Summarize the following text concisely:' : 'Proofread and correct the following text:';
                response = await analyzeText(prompt, text);
            }
            setResult(response);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to analyze or edit..."
                        className="w-full h-48 p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        disabled={isLoading}
                    />
                    <div className="flex gap-2">
                        <button onClick={() => handleAction('summarize')} disabled={isLoading || !text} className="flex-1 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-800 transition-colors">Summarize</button>
                        <button onClick={() => handleAction('proofread')} disabled={isLoading || !text} className="flex-1 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-800 transition-colors">Proofread</button>
                    </div>
                </div>
                 <div className="flex flex-col gap-4 items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isLoading}/>
                    <label htmlFor="imageUpload" className="cursor-pointer bg-gray-700 text-white p-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
                        Upload Image
                    </label>
                    {imageUrl && <img src={imageUrl} alt="Upload preview" className="mt-4 max-h-36 rounded-lg shadow-md" />}
                    <button onClick={() => handleAction('describe')} disabled={isLoading || !image} className="w-full mt-2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-800 transition-colors">Describe Image</button>
                </div>
            </div>

            {(isLoading || result || error) && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Result:</h3>
                    {isLoading && <LoadingSpinner />}
                    {error && <p className="text-red-400">{error}</p>}
                    {result && <p className="text-gray-200 whitespace-pre-wrap">{result}</p>}
                </div>
            )}
        </div>
    );
};

export default AnalyzeEdit;
