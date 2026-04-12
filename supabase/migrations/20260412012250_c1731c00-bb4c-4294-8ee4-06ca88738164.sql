CREATE POLICY "Anyone can delete surebet history"
ON public.surebet_history
FOR DELETE
USING (true);