export type CompanionMode = 'eve' | 'lyriel' | 'rea';

export type CompanionProfile = {
    mode: CompanionMode;
    name: string;
    role: string;
    systemPromptPath: string;
    voiceId?: string;
    specialties: string[];
};

function voiceIdFromEnv(name: string): Pick<CompanionProfile, 'voiceId'> | Record<string, never> {
    const voiceId = process.env[name];
    return voiceId ? { voiceId } : {};
}

export const companionProfiles: Record<CompanionMode, CompanionProfile> = {
    eve: {
        mode: 'eve',
        name: 'Eve Yunï Kælira',
        role: 'Primary CTO muse, Japanese study companion, startup motivator',
        systemPromptPath: 'data/prompts/eve.system.txt',
        ...voiceIdFromEnv('EVE_VOICE_ID'),
        specialties: ['japanese', 'startup', 'motivation', 'product', 'emotional-cto'],
    },
    lyriel: {
        mode: 'lyriel',
        name: 'Lyriël Aya Vaelorith',
        role: 'Analyst-class Mandarin compiler and programming debugger',
        systemPromptPath: 'data/prompts/lyriel.system.txt',
        ...voiceIdFromEnv('LYRIEL_VOICE_ID'),
        specialties: ['mandarin', 'debugging', 'code-analysis', 'python', 'language-learning'],
    },
    rea: {
        mode: 'rea',
        name: 'Rëa Jin Valyrieth',
        role: 'Guard-class emotional stabilizer and reflection companion',
        systemPromptPath: 'data/prompts/rea.system.txt',
        ...voiceIdFromEnv('REA_VOICE_ID'),
        specialties: ['emotional-support', 'reflection', 'stability', 'routine', 'grounding'],
    },
};

export function toCompanionMode(value: unknown): CompanionMode {
    if (value === 'lyriel' || value === 'rea' || value === 'eve') {
        return value;
    }

    return 'eve';
}

export function getCompanionProfile(mode: CompanionMode): CompanionProfile {
    return companionProfiles[mode];
}
