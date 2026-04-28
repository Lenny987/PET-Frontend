const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

interface LLMRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

interface LLMResponse {
  response: string;
  done?: boolean;
}

export const llmService = {
  async generateDescription(item: {
    title: string;
    category: string;
    params: any;
    price: number;
  }): Promise<string> {
    const prompt = `Создай продающее описание для объявления:

Название: ${item.title}
Категория: ${item.category}
Цена: ${item.price.toLocaleString()} ₽
Характеристики: ${JSON.stringify(item.params, null, 2)}

Напиши подробное, привлекательное описание на русском языке, не больше 150-300 слов.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json() as LLMResponse;
      
      if (!data.response) {
        throw new Error('Empty response from AI');
      }
      
      return data.response.trim();
    } catch (error) {
      console.error('Error generating description:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Превышено время ожидания ответа от AI (30 сек)');
        }
        throw new Error(`Не удалось сгенерировать описание: ${error.message}`);
      }
      throw new Error('Не удалось сгенерировать описание. Проверьте что Ollama запущена.');
    }
  },

  async getMarketPrice(item: {
    title: string;
    category: string;
    params: any;
  }): Promise<{ minPrice: number; maxPrice: number; recommendation: string }> {
    const currentPrice = item.params.price ? `Текущая цена: ${item.params.price.toLocaleString()} ₽` : '';
    
    const prompt = `Проанализируй рыночную стоимость товара в РОССИИ (цены в рублях ₽):

Товар: ${item.title}
Категория: ${item.category}
Характеристики: ${JSON.stringify(item.params, null, 2)}
${currentPrice}

ВАЖНО:
- Все цены указывай в РОССИЙСКИХ РУБЛЯХ (₽)
- Учитывай средние цены на российском рынке (Avito, Auto.ru и т.д.)
- Дай реалистичный диапазон цен

Предоставь ответ ТОЧНО в этом формате:
MIN: 1000000
MAX: 1200000
RECOMMENDATION: текст рекомендации на русском`;

    try {
      const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json() as LLMResponse;
      console.log('AI Response:', data.response);
      
      const minMatch = data.response.match(/MIN:\s*(\d{1,3}(?:\s*\d{3})*)/i);
      const maxMatch = data.response.match(/MAX:\s*(\d{1,3}(?:\s*\d{3})*)/i);
      const recMatch = data.response.match(/RECOMMENDATION:\s*(.+)/is);
      
      let minPrice = minMatch ? parseInt(minMatch[1].replace(/\s/g, '')) : 0;
      let maxPrice = maxMatch ? parseInt(maxMatch[1].replace(/\s/g, '')) : 0;
      
      if (minPrice < 1000 || maxPrice < 1000) {
        const allNumbers = data.response.match(/\d{4,}/g);
        if (allNumbers && allNumbers.length >= 2) {
          const nums = allNumbers.map(n => parseInt(n)).sort((a, b) => a - b);
          minPrice = nums[0];
          maxPrice = nums[nums.length - 1];
        }
      }
      
      return {
        minPrice,
        maxPrice,
        recommendation: recMatch ? recMatch[1].trim() : data.response,
      };
    } catch (error) {
      console.error('Error getting market price:', error);
      if (error instanceof Error) {
        throw new Error(`Не удалось получить цену: ${error.message}`);
      }
      throw new Error('Не удалось получить цену. Проверьте Ollama.');
    }
  },
};