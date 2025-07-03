import { getMockEstimateData, getMockProjectData, getMockScheduleData, getMockTaskList, isDemoModeEnabled } from "@server/constants/demo-model.contant";
import { Request, Response } from "express";

export const testJsonHandler = (req: Request, res: Response) => {
    console.log('✅ JSON test endpoint hit');
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        message: 'JSON response working correctly!',
        timestamp: new Date().toISOString()
    });
}


export const testOpenAIHandler = async (req: Request, res: Response) => {
    console.log('🔗 OpenAI test endpoint hit');
    res.setHeader('Content-Type', 'application/json');

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "user", content: "Say 'OpenAI connection successful!' in one sentence." }],
                max_tokens: 50
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenAI API error: ${response.status} - ${errorText}`);
            return res.json({ success: false, error: `API Error ${response.status}: ${errorText}` });
        }

        const data = await response.json();
        console.log('✅ OpenAI test successful');
        res.json({ success: true, message: (data as any).choices[0]?.message?.content || 'OpenAI connected!' });

    } catch (error) {
        console.error('OpenAI connection error:', error);
        res.json({ success: false, error: error instanceof Error ? error.message : 'Something went wrong' });
    }
}

export const testJsonHandler2 = async (req: Request, res: Response) => {
    try {
        console.log('Testing JSON response...');
        res.json({
            success: true,
            message: 'JSON response working correctly!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('JSON test error:', error);
        res.status(500).json({
            success: false,
            error: 'JSON test failed'
        });
    }
}

export const testOpenAIHandler2 = async (req: Request, res: Response) => {
    try {
        console.log('Testing OpenAI API connection...');
        console.log('API Key present:', !!process.env.OPENAI_API_KEY);
        console.log('API Key length:', process.env.OPENAI_API_KEY?.length);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: "Say 'OpenAI connection successful!' in one sentence."
                    }
                ],
                max_tokens: 50
            })
        });

        console.log('OpenAI test response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenAI API test error: ${response.status} - ${errorText}`);
            return res.status(500).json({
                success: false,
                error: `API Error ${response.status}: ${errorText}`
            });
        }

        const data = await response.json();
        console.log('OpenAI test successful!');
        res.json({
            success: true,
            message: (data as any).choices[0]?.message?.content || 'Test successful!'
        });

    } catch (error) {
        console.error('OpenAI test connection error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error && error.message
        });
    }
}


export const demoStatusHandler = (req: Request, res: Response) => {
    res.json({
        isDemoMode: isDemoModeEnabled(),
        demoData: isDemoModeEnabled() ? {
            project: getMockProjectData(),
            estimates: [getMockEstimateData()],
            schedules: getMockScheduleData(),
            tasks: getMockTaskList()
        } : null
    });
}