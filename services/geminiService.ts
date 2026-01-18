export const askOracle = async (question: string) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    
    if (!response.ok) throw new Error('Oracle offline');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Oracle Failure:', error);
    return 'SYSTEM_ERROR: ORACLE_OFFLINE. PLEASE TRY AGAIN.';
  }
};