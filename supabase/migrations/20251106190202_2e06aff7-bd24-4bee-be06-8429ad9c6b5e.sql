-- Remove a policy problemática que causa recursão infinita
DROP POLICY IF EXISTS "Admins can view all user roles" ON user_roles;

-- Cria policy corrigida: admins podem ver todas as roles usando a função SECURITY DEFINER
CREATE POLICY "Admins can view all user roles"
ON user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Permite que admins insiram roles (necessário para criar novos admins)
CREATE POLICY "Admins can insert user roles"
ON user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Permite que admins atualizem roles
CREATE POLICY "Admins can update user roles"
ON user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Permite que admins deletem roles
CREATE POLICY "Admins can delete user roles"
ON user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));