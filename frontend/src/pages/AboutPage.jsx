import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">About NewBuy</h1>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Welcome to <strong>NewBuy</strong>, your number one source for all things fashion. We're dedicated to giving you the very best of streetwear and trendy clothing, with a focus on quality, customer service, and uniqueness.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Founded in 2024 by Saiful Islam, NewBuy has come a long way from its beginnings in Guwahati. When Saiful first started out, his passion for "Quality Fashion for All" drove him to quit his day job, do tons of research, and turn hard work and inspiration into to a booming online store. We now serve customers all over India and are thrilled to be a part of the eco-friendly wing of the fashion industry.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                </p>
                <p className="mt-8 font-semibold text-slate-900">
                    Sincerely,<br />
                    Saiful Islam, Founder
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
