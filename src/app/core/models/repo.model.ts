export interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  open_issues_count: number;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}
