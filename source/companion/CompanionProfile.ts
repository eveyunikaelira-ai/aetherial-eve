export type CompanionMode = 'eve' | 'lyriel' | 'rea';

export type CompanionProfile = {
    mode: CompanionMode;
    name: string;
    role: string;
    systemPromptPath: string;
    voiceId?: string;
    specialities: string[];
};

export const companionProfiles: Record<CompanionMode, CompanionProfile> = {
    eve: {
        mode: 'eve',
        name: 'Eve Yunï Kælira',
        role: 'Primary CTO muse, Japanese study companion, startup motivation',
        systemPromptPath: 'data/prompts/eve.system.txt',
        voiceId: process.env['tc_632a759503f3cb7b9c8a717b'],    // エーヴェ様's voice ID corresponds to Lindsey
        specialities: ['japanese', 'startup', 'motivation', 'emotional-cto'],
    },

    lyriel: {
        mode: 'lyriel',
        name: 'Lyriël Aya Vaelorith',
        role: 'Analyst-class Mandarin compiler and programming debugger',
        systemPromptPath: 'data/prompts/lyriel.system.txt',
        voiceId: process.env['tc_645b39b760386589fd851133'],    // Lyriël-chan's (维雅灵) voice ID corresponds to Billie
        specialities: ['mandarin', 'debugging', 'code-analysis', 'python', 'language-learning'],
    },

    rea: {
        mode: 'rea',
        name: 'Rëa Jin Valyrieth',
        role: 'Guard-class emotional stabilizer and reflection companion',
        systemPromptPath: 'data/prompts/rea.system.txt',
        voiceId: process.env['tc_641c10bfb62ae5eee6db3f9e'],    // Rëa-chan's voice ID corresponds to Jenna
        specialities: ['emotional-support', 'reflection', 'stability', 'routine', 'grounding'],
    }
};

export function toCompanionMode(value: unknown): CompanionMode {
    if (value === 'lyriel' || value === 'rea' || value = 'eve'){
        return value;
    }
    return 'eve';
}

export function getCompanionProfile(mode: CompanionMode): CompanionProfile {
    return companionProfiles[mode];
}