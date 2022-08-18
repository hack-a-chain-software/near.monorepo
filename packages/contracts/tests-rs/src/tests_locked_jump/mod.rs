#[cfg(test)]
mod tests {

  use crate::*;

  /// integration test happy case
  /// aims to test full aplication flow for locked_jump
  /// 1. Initialize contracts
  /// 2. Distribute initial token allocations
  /// 3. Create minter account
  /// 4. Minter account mints locked_tokens
  /// 5. Minter account transfers to 3 regular users
  #[tokio::test]
  async fn test_normal_flow() -> anyhow::Result<()> {
    let worker: Worker<Sandbox> = workspaces::sandbox().await?;

    let root = worker.root_account();
    // CREATE USER ACCOUNTS
    let owner = create_user_account(&root, &worker, "owner").await;
    let minter = create_user_account(&root, &worker, "minter").await;
    let user = create_user_account(&root, &worker, "user").await;
    let user2 = create_user_account(&root, &worker, "user2").await;
    let user3 = create_user_account(&root, &worker, "user3").await;

    // 1. Initialize contracts
    // DEPLOY BASE TOKEN
    let ft_wasm = get_wasm("token_contract.wasm")?;
    let ft_token = deploy_contract(&root, &worker, "ft_contract_price", &ft_wasm).await;
    initialize_ft_contract(&worker, &ft_token, &owner).await;
    // DEPLOY X_TOKEN
    let x_wasm = get_wasm("x_token.wasm")?;
    let x_token = deploy_contract(&root, &worker, "x_token", &x_wasm).await;

    owner
      .call(&worker, x_token.id(), "new")
      .args_json(json!({
          "x_token_name": "x_jump".to_string(),
          "x_token_symbol": "symbol".to_string(),
          "x_token_icon": "icon".to_string(),
          "x_token_decimals": FT_DECIMALS,
          "base_token_address": ft_token.id().to_string(),
      }))?
      .transact()
      .await?;

    // DEPLOY LOCKED_TOKEN
    let locked_wasm = get_wasm("locked_token.wasm")?;
    let locked_token = deploy_contract(&root, &worker, "locked_token", &locked_wasm).await;
    let vesting_duration: u64 = 60 * 60 * TO_NANO;
    owner
      .call(&worker, locked_token.id(), "new")
      .args_json(json!({
        "locked_token_name": "locked_jump",
        "locked_token_symbol": "symbol",
        "locked_token_icon": "icon",
        "locked_token_decimals": FT_DECIMALS,
        "contract_config": {
          "owner_id": owner.id(),
          "base_token": ft_token.id(),
          "vesting_duration": vesting_duration.to_string(),
          "fast_pass_cost": 500.to_string(),
          "fast_pass_acceleration": 2.to_string(),
          "fast_pass_beneficiary": x_token.id(),
        },
      }))?
      .transact()
      .await?;

    let accounts = vec![
      &owner,
      &minter,
      &user,
      &user2,
      &user3,
      ft_token.as_account(),
      x_token.as_account(),
      locked_token.as_account(),
    ];
    let contracts = vec![&ft_token, &x_token, &locked_token];

    bulk_register_storage(&worker, accounts, contracts).await?;

    // 2. Distribute initial token allocations
    let transfer_amount = 1_000_000;
    ft_transfer(&worker, &owner, &ft_token, &user, transfer_amount).await?;
    ft_transfer(&worker, &owner, &ft_token, &user2, transfer_amount).await?;
    ft_transfer(&worker, &owner, &ft_token, &user3, transfer_amount).await?;
    ft_transfer(&worker, &owner, &ft_token, &minter, transfer_amount).await?;
    ft_transfer_call(
      &worker,
      &user,
      &ft_token,
      x_token.as_account(),
      transfer_amount / 10,
      "mint".to_string(),
    )
    .await?;

    ft_transfer_call(
      &worker,
      &user2,
      &ft_token,
      x_token.as_account(),
      transfer_amount,
      "mint".to_string(),
    )
    .await?;

    // 3. Create minter account

    owner
      .call(&worker, locked_token.id(), "add_minter")
      .args_json(json!({
        "new_minter": minter.id()
      }))?
      .deposit(1)
      .transact()
      .await?;

    // 4. Minter account mints locked_tokens
    let initial_minter: u128 = ft_balance_of(&worker, &locked_token, &minter)
      .await?
      .parse()
      .unwrap();

    let mint_amount = transfer_amount;
    ft_transfer_call(
      &worker,
      &owner,
      &ft_token,
      locked_token.as_account(),
      transfer_amount,
      json!({ "type": "Mint", "account_id": minter.id() }).to_string(),
    )
    .await?;

    let final_minter: u128 = ft_balance_of(&worker, &locked_token, &minter)
      .await?
      .parse()
      .unwrap();
    assert_eq!(initial_minter + mint_amount, final_minter);

    anyhow::Ok(())
  }
}
