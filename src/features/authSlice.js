import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../utils/supabase';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for user login (Supabase Auth)
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) return rejectWithValue(authError.message);

  const userId = authData.user?.id;
  if (!userId) return rejectWithValue('Login falhou: usuário inválido.');

  // Fetch profile from public.users (RLS garante somente o próprio)
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (profileError) return rejectWithValue(profileError.message);

  return {
    id: userId,
    email: authData.user.email,
    name: profile.name || '',
    plan: profile.plan || 'Básico',
    is_admin: !!profile.is_admin,
    createdAt: profile.created_at,
  };
});

// Async thunk for user registration (Supabase Auth)
export const registerUser = createAsyncThunk('auth/registerUser', async ({ name, email, password, plan }, { rejectWithValue }) => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, plan } },
  });
  if (signUpError) return rejectWithValue(signUpError.message);

  const userId = signUpData.user?.id;
  if (!userId) {
    // Em projetos com confirmação por email, a sessão pode não existir ainda.
    return {
      id: null,
      email,
      name,
      plan: plan || 'Básico',
      is_admin: false,
      createdAt: new Date().toISOString(),
      pendingConfirmation: true,
    };
  }

  // Buscar perfil recém-criado (trigger insere com name; plan pode estar padrão)
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (profileError) {
    // Não bloquear registro por falha de leitura de perfil
    return {
      id: userId,
      email,
      name,
      plan: plan || 'Básico',
      is_admin: false,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: userId,
    email,
    name: profile.name || name,
    plan: profile.plan || plan || 'Básico',
    is_admin: !!profile.is_admin,
    createdAt: profile.created_at,
  };
});

export const initAuth = createAsyncThunk('auth/initAuth', async (_, { rejectWithValue }) => {
  try {
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return rejectWithValue(error.message);
    if (!user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (profileError) return rejectWithValue(profileError.message);

    return {
      id: user.id,
      email: user.email,
      name: profile.name || '',
      plan: profile.plan || 'Básico',
      is_admin: !!profile.is_admin,
      createdAt: profile.created_at,
    };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Mantém comportamento anterior: autenticar após registro
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Hydrate from existing Supabase session
      .addCase(initAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(initAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
