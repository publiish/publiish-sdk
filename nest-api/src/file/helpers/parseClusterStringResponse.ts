import { ClusterFile } from '../types.js';

export const parseClusterStringResponse = (ipfsData: string) => {
  const jsonStrings = ipfsData.split('\n');

  return jsonStrings
    .filter((s) => s.length > 0)
    .map((s) => JSON.parse(s)) as ClusterFile[];
};
