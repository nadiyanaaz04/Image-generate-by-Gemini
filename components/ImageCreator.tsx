import React, { useState } from 'react';
import { createImage } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';

const ImageCreator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setImageUrl(null);
        setError('');

        try {
            const url = await createImage(prompt);
            if (url) {
                setImageUrl(url);
            } else {
                setError('Failed to generate image. Please try a different prompt.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center">
            <form onSubmit={handleGenerateImage} className="w-full max-w-2xl flex items-center">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A futuristic cityscape at sunset, synthwave style"
                    disabled={isLoading}
                    className="flex-grow p-3 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <LoadingSpinner /> : 'Generate'}
                </button>
            </form>

            <div className="w-full max-w-2xl min-h-[400px] bg-gray-700 rounded-lg flex items-center justify-center p-4">
                {isLoading && (
                  <div className="text-center text-gray-400">
                    <LoadingSpinner />
                    <p className="mt-2">Generating your masterpiece... this can take a moment.</p>
                  </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt={prompt} className="max-w-full max-h-full rounded-md shadow-lg" />
                )}
                {!imageUrl && !isLoading && !error && (
                    <p className="text-gray-500">Your generated image will appear here.</p>
                )}
            </div>
        </div>
    );
};

export default ImageCreator;
